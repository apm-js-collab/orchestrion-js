use crate::common::*;
use orchestrion_js::*;

#[test]
fn multiple_load_cjs() {
    transpile_and_test(
        file!(),
        false,
        Config::new_single(InstrumentationConfig::new(
            ModuleMatcher::new("undici", ">=0.0.1", "tests/multiple_load_cjs/index.mjs").unwrap(),
            FunctionQuery::class_method("Undici", "fetch", FunctionKind::Async),
            "Undici_fetch",
        )),
    );
}
