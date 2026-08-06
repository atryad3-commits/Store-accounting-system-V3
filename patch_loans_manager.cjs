const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

code = code.replace(
/description: \`ثبت اولیه وام \$\{formData\.type === 'given' \? 'پرداختی' : 'دریافتی'\}\`,/g,
`description: formData.type === 'given' ? \`اعطای وام پرداختی شماره \${loanId}\` : \`اخذ وام دریافتی شماره \${loanId}\`,`
);

code = code.replace(
/description: \`پرداخت قسط وام\`,/g,
`description: loan.type === 'given' ? \`دریافت قسط وام شماره \${loan.id}\` : \`پرداخت قسط وام شماره \${loan.id}\`,`
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
