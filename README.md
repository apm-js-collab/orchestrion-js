# `@apm-js-collab/code-transformer`

This is a temporary fork of [`DataDog/orchestrion-js`](https://github.com/DataDog/orchestrion-js/). We intend all changes to be upstreamed to the original repository, 

This is a library for instrumenting Node.js libraries at build or load time.

It provides `VisitMut` implementations for SWC's AST nodes, which can be used to insert tracing code into matching functions. 
It can be used in SWC plugins, or anything else that mutates JavaScript ASTs using SWC.

`@apm-js-collab/code-transformer` is built as a JavaScript module, which can be used from Node.js.

To build the JavaScript module:
- Ensure you have [Rust installed](https://www.rust-lang.org/tools/install)
- Install the wasm toolchain `rustup target add wasm32-unknown-unknown --toolchain stable`
- Install dependencies and build the module `npm install && npm run build`

## Contributing

See CONTRIBUTING.md

## License

See LICENSE
