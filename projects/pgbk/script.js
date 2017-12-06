---
---

'use strict;'

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

    fetchAndInstantiate('{{ site.url }}/assets/wasm/password_generator_by_keyword.wasm', { env: imports })
        .then(mod => {
            exports = mod.exports;

            let generate_password = () => {
                let s = exports.generate_password(
                    newString(exports, serviceName.value),
                    newString(exports, keyword.value),
                    passwordLength.value,
                    useSpecialCharacters.checked
                );
                password.value = copyCStr(exports, s);
            };

            serviceName.oninput = generate_password;
            keyword.oninput = generate_password;
            passwordLength.oninput = generate_password;
            useSpecialCharacters.onchange = generate_password;
        });
};
