const fs = require('fs');
let code = fs.readFileSync('src/services/loanStateMachine.ts', 'utf8');

if (!code.includes('generateInstallmentCode')) {
    code = code.replace(
        /import \{ toEnglishNumbers \} from '\.\.\/utils\/format';/,
        `import { toEnglishNumbers } from '../utils/format';\nimport { generateInstallmentCode } from '../utils/installmentUtils';`
    );
}

code = code.replace(
    /inst\.dueDate = convertToGregorian\(dueDateStr\)\.split\('T'\)\[0\];/,
    `const gregorianDueDate = convertToGregorian(dueDateStr).split('T')[0];
          inst.dueDate = gregorianDueDate;
          inst.installmentCode = generateInstallmentCode(loanId, loan.loanNumber, idx, gregorianDueDate);`
);

fs.writeFileSync('src/services/loanStateMachine.ts', code);
