use crate::common::*;
use orchestrion_js::*;

#[test]
fn polyfill_cjs() {
    transpile_and_test(
        file!(),
        false,
        Config::new(
            vec![InstrumentationConfig::new(
                ModuleMatcher::new("undici", ">=0.0.1", "tests/polyfill_cjs/index.mjs").unwrap(),
                FunctionQuery::function_declaration("fetch", FunctionKind::Async),
                "fetch_decl",
            )],
            Some("./polyfill.js".to_string()),
        ),
    );
}
