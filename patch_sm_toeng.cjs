const fs = require('fs');
let code = fs.readFileSync('src/services/loanStateMachine.ts', 'utf8');

code = code.replace(/import \{ toEnglishNumbers \} from '\.\.\/utils\/format';\n/, '');

code = code.replace(
    /export async function applyTransition/,
    `const toEnglishNumbers = (str: string) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    let res = str;
    for (let i = 0; i < 10; i++) {
        res = res.replace(new RegExp(persianNumbers[i], 'g'), i.toString());
    }
    return res;
};

export async function applyTransition`
);

fs.writeFileSync('src/services/loanStateMachine.ts', code);
