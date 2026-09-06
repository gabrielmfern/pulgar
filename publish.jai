#import "Basic";
#import "Compiler";
#import "File";
#import "String";
#import "Process";

#run {
    set_build_options_dc(.{do_output=false});
    if !publish() {
        compiler_set_workspace_status(.FAILED);
    }
}

#if OS == .WINDOWS {
    JAI      :: "jai";
    PLATFORM :: "win32";
    FILES    :: string.["testa.exe", "shim.dll", "libnode.dll"];
} else #if OS == .LINUX {
    JAI      :: "jai-linux";
    PLATFORM :: "linux";
    FILES    :: string.["testa", "shim.so", "libnode.so.137"];
} else #if OS == .MACOS {
    JAI      :: "jai-macos";
    PLATFORM :: "darwin";
    FILES    :: string.["testa", "shim.dylib", "libnode.137.dylib"];
}
publish :: () -> bool {
    ARCH :: #ifx CPU == .ARM64 then "arm64" else "x64";

    result := run_command(JAI, "build.jai", "-optimized");
    if result.exit_code != 0 {
        print("build.jai failed\n");
        return false;
    }

    root, ok := read_entire_file("package.json");
    if !ok return false;
    found, _, after := split_from_left(root, "\"version\": \"");
    if !found {
        print("no version in package.json\n");
        return false;
    }
    _, version, _ := split_from_left(after, #char "\"");

    files: String_Builder;
    for FILES {
        if it_index append(*files, ", ");
        print_to_builder(*files, "\"%\"", it);
    }

    dir := tprint("dist/%-%", PLATFORM, ARCH);
    package := tprint(#string JSON
{
  "name": "@testajs/%1-%2",
  "version": "%3",
  "description": "%1 %2 binary for testajs",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/gabrielmfern/testa.git"
  },
  "os": ["%1"],
  "cpu": ["%2"],
  "files": [%4]
}
JSON, PLATFORM, ARCH, version, builder_to_string(*files));
    if !write_entire_file(tprint("%/package.json", dir), package) return false;

    print("ready: cd % && npm publish --access public\n", dir);
    return true;
}
