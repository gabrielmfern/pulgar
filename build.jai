#import "Compiler";
#import "BuildCpp";
#import "Check";
#import "Bindings_Generator";
#import "File";
#import "File_Utilities";
#import "Basic";
#import "String";
#import "Process";
#if OS == .LINUX #import "POSIX";


#run build();

build :: () {
    publish := array_find(get_build_options().compile_time_command_line, "publish");
    debug := get_build_options().array_bounds_check == .ON;
    jails :: #exists(JAILS_DIAGNOSTICS_BUILD);

    set_build_options_dc(.{do_output=false});

    libnode_dir :: #ifx OS == .MACOS then "vendor/node/out/Release" else "vendor/node/out/Release/lib";
    // Executable + the shared libraries it needs at runtime, side by side.
    #if OS == .WINDOWS {
        platform :: "win32";
    } else #if OS == .LINUX {
        platform :: "linux";
    } else #if OS == .MACOS {
        platform :: "darwin";
    }
    arch :: #ifx CPU == .ARM64 then "arm64" else "x64";
    dist_dir := tprint("dist/%-%", platform, arch);

    // libnode is the only shared library that has to sit next to the executable at runtime; the shim
    // is linked into it statically. On Linux/macOS jai's default link adds an $ORIGIN/@loader_path
    // rpath; on Windows the exe's directory is searched by default.
    bindings_filename, libnode_lib: string;
    #if OS == .WINDOWS {
        bindings_filename = ".build/bindings-windows.jai";
        libnode_lib = "libnode.dll";
    } else #if OS == .LINUX {
        bindings_filename = ".build/bindings-linux.jai";
        libnode_lib = "libnode.so.137";
        if !file_exists(tprint("%/libnode.so", libnode_dir)) {
            if symlink("libnode.so.137", tprint("%/libnode.so\0", libnode_dir).data) != 0 {
                compiler_set_workspace_status(.FAILED);
                return;
            }
        }
    } else #if OS == .MACOS {
        bindings_filename = ".build/bindings-macos.jai";
        libnode_lib = "libnode.137.dylib";
    } else {
        assert(false);
    }

    options := get_build_options();
    extra: [..] string;
    array_add(
        *extra, 
        "-Ivendor/node/src",
        "-Ivendor/node/deps/uv/include",
        "-Ivendor/node/deps/v8/include",
    );
    // The shim is archived, not linked, so these are compile flags only - libnode itself is linked
    // into the executable further down, from the #library the bindings declare for it.
    #if OS == .WINDOWS {
        // Requires node built as a shared library: `vcbuild.bat dll` (produces libnode.dll + libnode.lib in out/Release).
        // Same defines node uses for executables that consume the shared libnode (see node.gypi),
        // so node/v8/uv symbols are dllimport'ed rather than treated as our own exports.
        array_add(*extra, "/std:c++20", "/Zc:__cplusplus",
            "/DNODE_SHARED_MODE", "/DBUILDING_NODE_EXTENSION", "/DUSING_V8_SHARED", "/DUSING_UV_SHARED", "/DUSING_V8_PLATFORM_SHARED");
    } else {
        array_add(*extra, "-std=c++20");
        #if OS == .MACOS {
            array_add(*extra, "-mmacosx-version-min=13.5");
        }
    }

    make_directory_if_it_does_not_exist(".build", recursive=true);
    if !jails && !build_cpp_static_lib(".build/shim", "shim.cpp", debug=debug, extra=extra) {
        compiler_set_workspace_status(.FAILED);
        return;
    }

    opts: Generate_Bindings_Options;
    {
        using opts;

        #if OS == .MACOS {
            array_add(*libraries, .{filename=tprint("%/libnode.137.dylib", libnode_dir), identifier="libnode"});
        } else {
            array_add(*libraries, .{filename=tprint("%/libnode", libnode_dir), identifier="libnode"});
        }
        array_add(*libraries, .{filename=".build/shim", identifier="shim"});
        // #library paths are resolved relative to the generated file, which sits in .build/.
        generated_library_path_prefix = "../";

        array_add(*source_files, "shim.h", "vendor/node/src/js_native_api.h");
        array_add(*include_paths, "vendor/node/src", "vendor/node/deps/uv/include", "vendor/node/deps/v8/include");
        array_add(*extra_clang_arguments, "-x", "c++", "-std=c++20");

        #if OS == .LINUX {
            _, _, clang_output := run_command("clang++", "-E", "-x", "c++", "-v", "/dev/null", capture_and_return_output=true);
            for split(clang_output, "\n") {
                if contains(it, "/c++/") {
                    array_add(*system_include_paths, trim(it));
                }
            }
        }
        array_add(*system_include_paths, ..get_default_system_include_paths());
    }

    if !jails && !generate_bindings(opts, bindings_filename) {
        compiler_set_workspace_status(.FAILED);
        return;
    }

    w := compiler_create_workspace("Main program");
    if !debug {
        set_optimization(*options, .OPTIMIZED);
    }
    if jails {
        options.output_type = .NO_OUTPUT;
    } else {
        options.output_type = .EXECUTABLE;
        options.output_executable_name = "pulgar";
        options.output_path = dist_dir;
        #if OS == .LINUX {
            // libgcc_s carries _Unwind_Resume, which the shim's C++ objects reference now that
            // they are linked into the executable instead of into a shared library.
            // By exact filename: the libgcc_s.so dev symlink lives in a gcc-version-specific
            // directory that is not on the linker's default search path, but the runtime library is.
            options.additional_linker_arguments = .["-lstdc++", "-l:libgcc_s.so.1"];
        } else #if OS == .MACOS {
            options.additional_linker_arguments = .["-lc++"];
        }
        make_directory_if_it_does_not_exist(dist_dir, recursive=true);
        if !copy_file(tprint("%/%", libnode_dir, libnode_lib), tprint("%/%", dist_dir, libnode_lib)) {
            compiler_set_workspace_status(.FAILED);
            return;
        }
        if publish {
            root, ok := read_entire_file("package.json");
            if !ok {
                compiler_set_workspace_status(.FAILED);
                return;
            }
            found, _, after := split_from_left(root, "\"version\": \"");
            if !found {
                print("no version in package.json\n");
                compiler_set_workspace_status(.FAILED);
                return;
            }
            _, version, _ := split_from_left(after, #char "\"");

            exe := ifx OS == .WINDOWS then "pulgar.exe" else "pulgar";

            package := tprint(#string JSON
{
  "name": "@pulgar/%1-%2",
  "version": "%3",
  "description": "%1 %2 binary for pulgar",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/gabrielmfern/pulgar.git"
  },
  "os": ["%1"],
  "cpu": ["%2"],
  "files": ["%4", "%5"]
}
JSON, platform, arch, version, exe, libnode_lib);
            if !write_entire_file(tprint("%/package.json", dist_dir), package) {
                compiler_set_workspace_status(.FAILED);
                return;
            }
        }
    }
    set_build_options(options, w);
    add_build_string(tprint("DEBUG :: %;", debug), w);
    add_build_file("pulgar.jai", w);
}
