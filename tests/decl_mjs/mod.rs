use crate::common::*;
use orchestrion_js::*;

#[test]
fn decl_mjs() {
    transpile_and_test(
        file!(),
        true,
        Config::new_single(InstrumentationConfig::new(
            test_module_matcher(),
            FunctionQuery::function_declaration("fetch", FunctionKind::Async),
            "fetch_decl",
        )),
    );
}
