const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

code = code.replace(
    /startDate: new Date\(\)\.toLocaleDateString\('fa-IR'\)\.replace\(\/\\\\\/g, '-'\)/g,
    `startDate: new Date().toISOString()`
);
// wait the regex for /\//g is actually:
code = code.replace(
    /new Date\(\)\.toLocaleDateString\('fa-IR'\)\.replace\(\/\\\/\\\/g, '-'\)/g,
    `new Date().toISOString()`
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
