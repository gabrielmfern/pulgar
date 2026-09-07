#pragma once
#include "node_api_types.h"

#ifdef _WIN32
#define SHIM_EXPORT __declspec(dllexport)
#else
#define SHIM_EXPORT
#endif

#ifdef __cplusplus
extern "C" {
#endif

typedef struct node_initialization_result node_initialization_result;
typedef struct node_multi_isolate_platform node_multi_isolate_platform;
typedef struct node_common_environment_setup node_common_environment_setup;
typedef struct node_environment node_environment;
typedef struct v8_scope v8_scope;

SHIM_EXPORT node_initialization_result* node_initialize_once_per_process(void);
SHIM_EXPORT int node_initialization_result_early_return(node_initialization_result* result);
SHIM_EXPORT int node_initialization_result_exit_code(node_initialization_result* result);

SHIM_EXPORT node_multi_isolate_platform* node_multi_isolate_platform_create(int thread_pool_size);

SHIM_EXPORT void v8_initialize(node_multi_isolate_platform* platform);

SHIM_EXPORT node_common_environment_setup* node_common_environment_setup_create(node_multi_isolate_platform* platform, node_initialization_result* result);
SHIM_EXPORT node_environment* node_common_environment_setup_env(node_common_environment_setup* setup);

SHIM_EXPORT v8_scope* v8_scope_open(node_common_environment_setup* setup);
SHIM_EXPORT void v8_scope_close(v8_scope* scope);

SHIM_EXPORT void node_add_linked_binding(node_environment* env, const char* name, napi_addon_register_func fn);
SHIM_EXPORT int node_load_environment(node_environment* env, const char* script);
SHIM_EXPORT int node_load_environment_module(node_environment* env, const char* source, const char* resource_name);
SHIM_EXPORT int node_spin_event_loop(node_environment* env);
SHIM_EXPORT int node_spin_event_loop_once(node_common_environment_setup* setup);
SHIM_EXPORT void node_stop_event_loop(node_common_environment_setup* setup);
SHIM_EXPORT void node_cancel_terminate_execution(node_common_environment_setup* setup);
SHIM_EXPORT void node_clear_async_id_stack(node_common_environment_setup* setup);
SHIM_EXPORT void node_perform_microtask_checkpoint(node_common_environment_setup* setup);
typedef struct v8_promise v8_promise;
SHIM_EXPORT v8_promise* v8_promise_ref(napi_value value);
SHIM_EXPORT int v8_promise_state(v8_promise* promise);
SHIM_EXPORT napi_value v8_promise_result(v8_promise* promise);
SHIM_EXPORT void v8_promise_unref(v8_promise* promise);

typedef enum v8_value_kind {
    V8_VALUE_UNDEFINED,
    V8_VALUE_NULL,
    V8_VALUE_BOOLEAN,
    V8_VALUE_NUMBER,
    V8_VALUE_STRING,
    V8_VALUE_SYMBOL,
    V8_VALUE_BIGINT,
    V8_VALUE_OBJECT,
    V8_VALUE_ARRAY,
    V8_VALUE_FUNCTION,
    V8_VALUE_DATE,
    V8_VALUE_REGEXP,
    V8_VALUE_ERROR,
    V8_VALUE_MAP,
    V8_VALUE_SET,
    V8_VALUE_WEAK_MAP,
    V8_VALUE_WEAK_SET,
    V8_VALUE_PROMISE,
    V8_VALUE_NUMBER_OBJECT,
    V8_VALUE_STRING_OBJECT,
    V8_VALUE_BOOLEAN_OBJECT,
    V8_VALUE_BIGINT_OBJECT,
    V8_VALUE_SYMBOL_OBJECT,
    V8_VALUE_ARRAY_BUFFER,
    V8_VALUE_SHARED_ARRAY_BUFFER,
    V8_VALUE_TYPED_ARRAY,
    V8_VALUE_DATA_VIEW,
    V8_VALUE_PROXY,
    V8_VALUE_ARGUMENTS,
} v8_value_kind;
SHIM_EXPORT v8_value_kind v8_value_kind_of(napi_value value);
SHIM_EXPORT double v8_number_object_value(napi_value value);
SHIM_EXPORT int v8_boolean_object_value(napi_value value);
SHIM_EXPORT napi_value v8_string_object_value(napi_value value);
SHIM_EXPORT napi_value v8_symbol_object_value(napi_value value);
SHIM_EXPORT int v8_same_object(napi_value a, napi_value b);
SHIM_EXPORT napi_value v8_function_name(napi_value value);
SHIM_EXPORT napi_value v8_constructor_name(napi_value value);
SHIM_EXPORT napi_value v8_symbol_description(napi_value value);
SHIM_EXPORT napi_value v8_regexp_source(napi_value value);
SHIM_EXPORT int v8_regexp_flags(napi_value value);
SHIM_EXPORT size_t v8_map_size(napi_value value);
SHIM_EXPORT size_t v8_set_size(napi_value value);
SHIM_EXPORT napi_value v8_map_as_array(napi_value value);
SHIM_EXPORT napi_value v8_set_as_array(napi_value value);

#ifdef __cplusplus
}
#endif
