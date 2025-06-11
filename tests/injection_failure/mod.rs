use crate::common::*;
use orchestrion_js::*;

#[test]
fn injection_failure() {
    transpile_and_test(
        file!(),
        true,
        Config::new_single(InstrumentationConfig::new(
            "some_expr",
            test_module_matcher(),
            FunctionQuery::function_expression("some", FunctionKind::Async),
        )),
    );
}
