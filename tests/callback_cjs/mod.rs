use crate::common::*;
use orchestrion_js::*;

#[test]
fn callback_cjs() {
    transpile_and_test_with_imports(
        file!(),
        false,
        Config::new_single(InstrumentationConfig::new_with_callback_config(
            "foo_ch",
            ModuleMatcher::new("foo", ">=1.0.0", "index.js").unwrap(),
            FunctionQuery::FunctionExpression {
                expression_name: "doWork".to_string(),
                kind: FunctionKind::Callback,
                index: 0,
            },
            CallbackConfig { position: 1 },
        )),
        &[PackageImport {
            module_name: "foo".to_string(),
            module_version: "1.1.1".to_string(),
            file: "index.js".to_string(),
        }],
    )
}
