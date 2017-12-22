---
layout: post
title: "A rust password generator on wasm"
date: 2017-12-22
categories: [rust, wasm]
comments: true
---

This is the useful app, which is a bit more complex than "Hello, World!". This app can help to generate different passwords for every service. You need to remember your keyword and the length of password only.

Here is the [source code](https://github.com/arkada38/rust-wasm-pgbk). Also, you can use the app on a [dedicated tab]({{ site.url }}/projects/pgbk/).

I've written this app on [C#](https://github.com/arkada38/Password-Generator-Keyword) one year ago. So, I have already the working algorithm which is suitable for practicing in programming on rust.

I'd like to wrote the logic on rust, compile it to wasm module and write UI via HTML and JS.

The UI part is pretty simple. It represents the form with a few inputs and one output. It's not the subject of our interest.

## The logic

Our main goal is to write the function which accepts:

{: .list-group}
- {:.list-group-item} String with service name
- {:.list-group-item} String with keyword
- {:.list-group-item} Integer with the length of password
- {:.list-group-item} Boolean for using special characters in the password

### Pseudorandom number generator

This application is designed to work identically on every platform and programming language. Every language has an implementation of random, but it works differently. So we are trying to make it working the way it would create same passwords on different platforms.

I've implemented the simple pseudorandom number generator, which returns `usize` from `0` to `n`.

```rust
const M: usize = (38 * 4 + 3) * (62 * 4 + 3);
static mut SEED: usize = 0;

fn next_random(n: usize) -> usize {
    let x: f64;

    unsafe {
        SEED = SEED * SEED % M;
        x = ((n - 1) * SEED) as f64 / M as f64;
    }
    
    x.round() as usize
}
```

`M = p × q` where `p % 4 = 3` and `q % 4 = 3`. It's an important requirement for generating the long sequence. This desicion has a few underlying potential problems. The main of it is a lack of cryptographic strength, but still this is a much better alternative to using only one password for every service.

### The seed

Now we know that we need to use the seed for reproducing the same sequence of random numbers. But how to calculate the seed? Remember that the function `generate_password` has four parametres. 3 of 4 parameters will influence on the seed. I've decided not to use the 4th parameter as it highly changes the password by adding a special characters.

```rust
unsafe {
    SEED = (service_name_score + service_name_score % 9 +
        keyword_score - keyword_score % 4 -
        password_length + password_length % 2) as usize;
}
```

I've written the function which calculates the score of the `String`. It's being used for `service_name_score` and `keyword_score` calculation.

```rust
fn get_score_of_utf8_bytes(s: &String) -> i32 {
    let mut score = 0;

    for (i, c) in s.as_bytes().iter().enumerate() {
        if i % 2 != 0 {
            score += 2 * *c as i32
        } else {
            score -= *c as i32
        }
    }

    score % 1000
}
```

### Alphabet

The password can contain letters in both cases, numbers and symbols. I've choosen the next characters for every group.

```rust
const UPPERCASE_LETTERS: &str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_LETTERS: &str = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS: &str = "1234567890";
const SPECIAL_CHARACTERS: &str = "!#$%'()*+-./:?@[]^_`{}~";
```

### Password requirements

We cannot take and mix all characters from above for creating a password because it's highly possible to get repeatable or consecutivable characters. This will result in having a weak password.

So I've borrowed the requirements from [Password Meter](http://www.passwordmeter.com/).
Then I've created four groups with characters for the password and mixed them by the borrowed rules.

## Generating WebAssembly module

We have the working algorithm on Rust. It's time to create a wasm module.

### Wrapper

The process of sending the string from JS to Rust and back again is not clear. WebAssembly doesn't natively support a string type. We need to encode the string, allocate some space in the exported memory buffer and copy over the encoded string. On the Rust we need to decode `*mut c_char`. You can find a clear example in this [post]({{ site.url }}/2017/12/04/rust-wasm-string-to-uppercase/).

The wrapper of Rust function.

```rust
#[no_mangle]
pub fn generate_password_c(
    service_name_c: *mut c_char,
    keyword_c: *mut c_char,
    password_length: i32,
    use_special_characters: bool) -> *mut c_char {
    let service_name: String;
    let keyword: String;

    unsafe {
        service_name = CString::from_raw(service_name_c).into_string().unwrap();
        keyword = CString::from_raw(keyword_c).into_string().unwrap();
    }
    
    let res = generate_password(service_name, keyword, password_length, use_special_characters);
    CString::new(res).unwrap().into_raw()
}
```

### Generetion code

You need to add `wasm32-unknown-unknown` and `wasm-gc`.

```bash
rustup update
rustup target add wasm32-unknown-unknown --toolchain nightly
cargo install --git https://github.com/alexcrichton/wasm-gc
```

Generating wasm module in build folder from rs file:

```bash
rustc +nightly --target wasm32-unknown-unknown -O --crate-type=cdylib src\main.rs -o build\main.big.wasm
```

Reducing the size by removing unused stuff from the module:

```bash
wasm-gc build\main.big.wasm build\main.wasm
```

### JavaScript

All available functions from wasm module will be assigned into `window.exports` object.
WebAssembly module needs for `round` function.
The password will be updated on user input.

```js
window.onload = function () {
    window.exports = {};

    let serviceName = document.querySelector('#serviceName'),
        keyword = document.querySelector('#keyword'),
        passwordLength = document.querySelector('#passwordLength'),
        useSpecialCharacters = document.querySelector('#useSpecialCharacters'),
        password = document.querySelector('#password');

    let imports = {
        round: Math.round
    };

    fetchAndInstantiate('main.wasm', { env: imports })
        .then(mod => {
            exports = mod.exports;

            let generate_password = () => {
                if (passwordLength.value >= 8 && passwordLength.value <= 60) {
                    let s = exports.generate_password_c(
                        newString(exports, serviceName.value),
                        newString(exports, keyword.value),
                        passwordLength.value,
                        useSpecialCharacters.checked
                    );
                    password.value = copyCStr(exports, s);
                } else password.value = '';
            };

            serviceName.oninput = generate_password;
            keyword.oninput = generate_password;
            passwordLength.oninput = generate_password;
            useSpecialCharacters.onchange = generate_password;
        });
};
```

## Result

{: .table .table-striped}
| Service name | Keyword | Length | Symbols | Password           |
|--------------|---------|-------:|:-------:|:------------------:|
| amazon       | qwerty  |     12 | false   | vKq4xFt7Gk2H       |
| google       | mustang |     18 | true    | wVcB6gIa:2W3p!Y8e} |
| reddit       | reddit  |     13 | true    | eS6gY*F2c-5wJ      |

![Example]({{ site.url }}/projects/pgbk/pgbk.gif)
