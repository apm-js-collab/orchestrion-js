use crate::common::*;
use orchestrion_js::*;

#[test]
fn object_method_cjs() {
    transpile_and_test(
        file!(),
        false,
        Config::new_single(InstrumentationConfig::new(
            ModuleMatcher::new("undici", ">=0.0.1", "tests/object_method_cjs/index.mjs").unwrap(),
            FunctionQuery::object_method("fetch", FunctionKind::Async),
            "Undici_fetch",
        )),
    );
}
