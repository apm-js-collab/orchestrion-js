use crate::common::*;
use orchestrion_js::*;

#[test]
fn constructor_mjs() {
    transpile_and_test(
        file!(),
        true,
        Config::new_single(InstrumentationConfig::new(
            test_module_matcher(),
            FunctionQuery::class_constructor("Undici"),
            "Undici_constructor",
        )),
    );
}
