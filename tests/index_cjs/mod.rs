use crate::common::*;
use orchestrion_js::*;

#[test]
fn index_cjs() {
    transpile_and_test(
        file!(),
        false,
        Config::new_single(InstrumentationConfig::new(
            ModuleMatcher::new("undici", ">=0.0.1", "tests/index_cjs/index.mjs").unwrap(),
            FunctionQuery::ClassMethod {
                class_name: "Undici".to_string(),
                method_name: "fetch".to_string(),
                kind: FunctionKind::Async,
                index: 2,
            },
            "Undici_fetch",
        )),
    );
}
