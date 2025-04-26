use crate::common::*;
use orchestrion_js::*;

#[test]
fn multiple_class_method_cjs() {
    transpile_and_test(
        file!(),
        false,
        Config::new(
            vec![
                InstrumentationConfig::new(
                    ModuleMatcher::new(
                        "undici",
                        ">=0.0.1",
                        "tests/multiple_class_method_cjs/index.mjs",
                    )
                    .unwrap(),
                    FunctionQuery::class_method("Undici", "fetch1", FunctionKind::Async),
                    "Undici_fetch1",
                ),
                InstrumentationConfig::new(
                    ModuleMatcher::new(
                        "undici",
                        ">=0.0.1",
                        "tests/multiple_class_method_cjs/index.mjs",
                    )
                    .unwrap(),
                    FunctionQuery::class_method("Undici", "fetch2", FunctionKind::Async),
                    "Undici_fetch2",
                ),
            ],
            None,
        ),
    );
}
