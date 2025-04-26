use crate::common::*;
use orchestrion_js::*;

#[test]
fn decl_cjs() {
    transpile_and_test(
        file!(),
        false,
        Config::new_single(InstrumentationConfig::new(
            ModuleMatcher::new("undici", ">=0.0.1", "tests/decl_cjs/index.mjs").unwrap(),
            FunctionQuery::function_declaration("fetch", FunctionKind::Async),
            "fetch_decl",
        )),
    );
}
