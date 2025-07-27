use crate::common::*;
use orchestrion_js::*;

#[test]
fn nested_fn() {
    transpile_and_test(
        file!(),
        false,
        Config::new_single(InstrumentationConfig::new(
            "nested_fn",
            test_module_matcher(),
            FunctionQuery::function_declaration("addHook", FunctionKind::Sync),
        )),
    );
}
