# Orchestion-JS

Orchestrion is a library for instrumenting Node.js libraries at build or load
time.

It provides `VisitMut` implementations for SWC's AST nodes, which can be used to
insert tracing code into matching functions. It can be used in SWC plugins, or
anything else that mutates JavaScript ASTs using SWC.

Orchestrion can also be built as a JavaScript module, which can be used from
Node.js.

To build the JavaScript module, ensure you have
[Rust installed](https://www.rust-lang.org/tools/install) and then run:

```bash
npm install && npm run build
```

## Contributing

See CONTRIBUTING.md

## License

See LICENSE
