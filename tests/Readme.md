# Unit Tests

Unit tests in this project follow a specific structure:

1. A directory named the same as the unit test. For example,
the `index_cjs` test will be within the `index_cjs/` directory.
2. A `mod.rs` file that contains the unit test.
3. A `mod.{js,mjs}` file that contains a JavaScript script to apply
the test against, i.e. this replicates a potential module from
npmjs.com.
4. A `test.js` file that exercises the patched code.
5. A new `mod` line in the [`instrumentor_test.rs`](./instrumentor_test.rs)
file.

To run a specific test from the command line:

```sh
# To run the index_cjs test only:
cargo test index_cjs
```

Each unit test should utilize the `transpile_and_test` function
exported by [`common/mod.rs`](./common/mod.rs). This function:

1. Reads in the unit test file to get the base path to the test.
2. Reads in the JavaScript module file.
3. Transforms the read-in JavaScript according to the defined configuration.
4. Generates a new `instrumented.js` file within the test directory. This
file contains the `mod.{js,mjs}` code patched by our tool.
5. Runs `node test.js` within the test directory. The result of this test
should be a `0` exit code for the process.
   
## Running In A Debugger

### RustRover

To run a specific test through the [RustRover](https://www.jetbrains.com/rust/)
debugger:

1. Create a new run configuration of type "Cargo".
2. For the "command", enter (e.g. for the `index_cjs` test):

        test --package orchestrion-js --test instrumentor_test index_cjs::index_cjs -- --exact
3. Set breakpoints and run the profile.

For a shortcut, open the desired `mod.rs` test file and click the "run"
button in the gutter.