use crate::common::*;
use orchestrion_js::*;

#[test]
fn expr_mjs() {
    transpile_and_test(
        file!(),
        true,
        Config::new_single(InstrumentationConfig::new(
            ModuleMatcher::new("undici", ">=0.0.1", "tests/expr_mjs/index.mjs").unwrap(),
            FunctionQuery::function_expression("fetch", FunctionKind::Async),
            "fetch_expr",
        )),
    );
}
