# Rust & WebAssembly

## Files tree

```tree
├── src
│   └── main.rs
├── build
│   └── main.wasm
├── index.html
├── script.js
├── run.but
└── README.md
```

## Preparatory work

```bash
rustup update
rustup target add wasm32-unknown-unknown --toolchain nightly
cargo install --git https://github.com/alexcrichton/wasm-gc
```

## Rust

Create `main.rs` file with some functions in `src` folder

```rust
#[no_mangle]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

## Wasm

Generate wasm module from rs file:

```bash
rustc +nightly --target wasm32-unknown-unknown -O --crate-type=cdylib src\main.rs -o build\main.big.wasm
```

Reduce the size by removing unused stuff from the module:

```bash
wasm-gc build\main.big.wasm build\main.wasm
```

## Web

### index.html

Create simple html page.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
      <meta charset="utf-8">
      <title>WebAssembly</title>
      <script src="script.js"></script>
  </head>
  <body>
    <input type="number" id="a" value="0">+
    <input type="number" id="b" value="0">=
    <output id="c">0</output>
  </body>
</html>
```

### script.js

The JavaScript code loads the WebAssembly module and has access to the exported function.

```javascript
window.onload = function() {
    let a = document.querySelector('#a'),
        b = document.querySelector('#b'),
        c = document.querySelector('#c');

    let add;

    let calc = function() {
        c.value = add(a.value, b.value);
    };

    a.oninput = calc;
    b.oninput = calc;

    fetch('build/main.wasm')
    .then(response => response.arrayBuffer())
    .then(bytes => WebAssembly.instantiate(bytes, {}))
    .then(results => {
        add = results.instance.exports.add;
    });
};
```

### Http server

For local testing http server needed. A good "ready-to-use tool" option could be browser-sync:

```bash
npm install -g browser-sync
```

To use it:

```bash
browser-sync start --server --port 3001 --files="./*"
```

## Batch helper script

Batch script for generation `.wasm` in `build` folder for every `.rs` in `src` folder

```batch
@echo off

for /r %%a in (src\*.rs) do call :process "%%a"
goto :eof

:process
if "%~x1"==".rs" (
    rustc +nightly --target wasm32-unknown-unknown -O --crate-type=cdylib src\%~n1.rs -o build\%~n1.big.wasm
    wasm-gc build\%~n1.big.wasm build\%~n1.wasm
    del build\%~n1.big.wasm
)
```
