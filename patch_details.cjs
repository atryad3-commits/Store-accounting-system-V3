const fs = require('fs');

const path = 'src/components/loans/LoanDetailsView.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    /const penalty = calculatePenalty\(loan, inst\);/g,
    `const penalty = Math.max(0, calculatePenalty(loan, inst) - (inst.penaltyPaidAmount || 0));`
);

code = code.replace(
    /\{formatCurrency\(penalty\)\} ریال جریمه/g,
    `{formatCurrency(penalty)} {currencyUnit} جریمه باقی‌مانده`
);

fs.writeFileSync(path, code);
