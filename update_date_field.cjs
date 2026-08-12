const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

// replace startDate default in form data
code = code.replace(
    /startDate: globalDateFormatter\.formatDateOnly\(new Date\(\)\)/,
    `startDate: globalDateFormatter.formatDateOnly(new Date()),
    firstInstallmentDate: globalDateFormatter.formatDateOnly(new Date())`
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
