# Changelog

## [0.7.2](https://github.com/apm-js-collab/orchestrion-js/compare/code-transformer-v0.7.1...code-transformer-v0.7.2) (2025-09-12)


### Bug Fixes

* Ensure build before publish ([#41](https://github.com/apm-js-collab/orchestrion-js/issues/41)) ([e196dcf](https://github.com/apm-js-collab/orchestrion-js/commit/e196dcf02ba0eac36811180f271db7ef1dc789db))

## [0.7.1](https://github.com/apm-js-collab/orchestrion-js/compare/code-transformer-v0.7.0...code-transformer-v0.7.1) (2025-09-11)

### Bug Fixes

* `versionRange` TypeScript definition ([#35](https://github.com/apm-js-collab/orchestrion-js/issues/35)) ([89cff5a](https://github.com/apm-js-collab/orchestrion-js/commit/89cff5a80bc1149c0bf0b930bf785c75b1d6ac2f))

## 0.7.0

- feat: Sourcemap support (#16)
- feat: Update all dependencies (#24)
- feat: Include module version in event args (#23)

### Bug Fixes

* `versionRange` TypeScript definition ([#35](https://github.com/apm-js-collab/orchestrion-js/issues/35)) ([89cff5a](https://github.com/apm-js-collab/orchestrion-js/commit/89cff5a80bc1149c0bf0b930bf785c75b1d6ac2f))

## 0.6.0

- fix: Allow for argumentation mutation in complex argument functions (#19)

## 0.5.0

- fix: Allow injecting into functions nested in functions (#17)

## 0.4.0

- feat: Error when code injection fails (#9)
- feat: Allow `unknown` module type (#11)
- fix: `wasm-pack` should be in `devDependencies` (#12)
- fix: Use uniquely named local variables (#13)

## 0.3.0

- fix: Handle `module.exports = class Foo` when locating classes (#7)

## 0.2.0

- fix: Ensure `channel_name` doesn't cause invalid JavaScript identifiers (#4)
- fix: Don't check for matching sync/async function type (#5)

## 0.1.1

- Initial publish of the temporary package.
