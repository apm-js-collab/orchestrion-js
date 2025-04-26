use crate::common::*;
use orchestrion_js::*;

#[test]
fn expr_cjs() {
    transpile_and_test(
        file!(),
        false,
        Config::new_single(InstrumentationConfig::new(
            ModuleMatcher::new("undici", ">=0.0.1", "tests/expr_cjs/index.mjs").unwrap(),
            FunctionQuery::function_expression("fetch", FunctionKind::Async),
            "fetch_expr",
        )),
    );
}
