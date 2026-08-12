const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoanCardModal.tsx', 'utf8');
code = code.replace(
    /\{storeSettings\?\.currency \|\| "تومان"\} جریمه باقی‌مانده/g,
    \`ریال جریمه باقی‌مانده\`
);
fs.writeFileSync('src/components/loans/LoanCardModal.tsx', code);
