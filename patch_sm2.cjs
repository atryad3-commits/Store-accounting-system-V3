const fs = require('fs');
let code = fs.readFileSync('src/services/loanStateMachine.ts', 'utf8');

// Replace the incorrect imports we added earlier
code = code.replace(
    /import \{ getInstallments, saveInstallments \} from '\.\/db';\n/,
    ``
);

code = code.replace(
    /import \{ getInstallments, getTransactions,/,
    `import { getInstallments, saveInstallments, getTransactions,`
);

fs.writeFileSync('src/services/loanStateMachine.ts', code);
