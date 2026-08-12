const fs = require('fs');
let code = fs.readFileSync('src/services/loanStateMachine.ts', 'utf8');

// I also need to ensure that the Accounting doc uses the paymentDate if available, rather than new Date().
// Let's check how Accounting document is created for 'active'
code = code.replace(
    /date: new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\],/,
    `date: dates?.paymentDate ? convertToGregorian(dates.paymentDate).split('T')[0] : new Date().toISOString().split('T')[0],`
);
code = code.replace(
    /jalaliDate: new Date\(\)\.toLocaleDateString\('fa-IR'\)\.replace\(\/\\\\\/g, '-'\),/,
    `jalaliDate: dates?.paymentDate ? dates.paymentDate : new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-'),`
);
code = code.replace(
    /date: loan\.startDate,/,
    `date: dates?.paymentDate ? convertToGregorian(dates.paymentDate).split('T')[0] : loan.startDate,`
);

fs.writeFileSync('src/services/loanStateMachine.ts', code);
