use crate::common::*;
use orchestrion_js::*;

#[test]
fn object_method_cjs() {
    transpile_and_test(
        file!(),
        false,
        Config::new_single(InstrumentationConfig::new(
            test_module_matcher(),
            FunctionQuery::object_method("fetch", FunctionKind::Async),
            "Undici_fetch",
        )),
    );
}
