const fs = require('fs');
function replaceInFile(path, regex, replacer) {
    if (fs.existsSync(path)) {
        let code = fs.readFileSync(path, 'utf8');
        code = code.replace(regex, replacer);
        fs.writeFileSync(path, code);
    }
}

replaceInFile(
    'src/components/loans/LoansArrears.tsx',
    /calculatePenalty\(inst.loan, inst\)/g,
    `Math.max(0, calculatePenalty(inst.loan, inst) - (inst.penaltyPaidAmount || 0))`
);

replaceInFile(
    'src/components/loans/LoanCardModal.tsx',
    /const penalty = calculatePenalty\(loan, inst\);/g,
    `const penalty = Math.max(0, calculatePenalty(loan, inst) - (inst.penaltyPaidAmount || 0));`
);

replaceInFile(
    'src/components/loans/LoanCardModal.tsx',
    /\{formatCurrency\(penalty\)\} ریال جریمه/g,
    `{formatCurrency(penalty)} {storeSettings?.currency || "تومان"} جریمه باقی‌مانده`
);

