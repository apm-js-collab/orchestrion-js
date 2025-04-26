use crate::common::*;
use orchestrion_js::*;

#[test]
fn polyfill_mjs() {
    transpile_and_test(
        file!(),
        true,
        Config::new(
            vec![InstrumentationConfig::new(
                test_module_matcher(),
                FunctionQuery::function_declaration("fetch", FunctionKind::Async),
                "fetch_decl",
            )],
            Some("./polyfill.js".to_string()),
        ),
    );
}
