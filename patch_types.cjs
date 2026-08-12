const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
    /startDate: string;/,
    `startDate: string;\n  requestDate?: string;\n  paymentDate?: string;\n  firstInstallmentDate?: string;`
);

fs.writeFileSync('src/types.ts', code);
