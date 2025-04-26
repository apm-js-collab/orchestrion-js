use crate::common::*;
use orchestrion_js::*;

#[test]
fn constructor_mjs() {
    transpile_and_test(
        file!(),
        true,
        Config::new_single(InstrumentationConfig::new(
            ModuleMatcher::new("undici", ">=0.0.1", "tests/constructor_mjs/index.mjs").unwrap(),
            FunctionQuery::class_constructor("Undici"),
            "Undici_constructor",
        )),
    );
}
