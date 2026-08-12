const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

code = code.replace(
    /تاریخ شروع قسط‌بندی/g,
    'تاریخ ثبت درخواست'
);
// Also rename `paymentDate` field in LoansManager modal if any (there was one initially)
fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
