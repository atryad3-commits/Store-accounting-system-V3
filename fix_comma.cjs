const fs = require('fs');
let code = fs.readFileSync('src/components/payroll/CreateSalaryPayroll.tsx', 'utf-8');
code = code.replace(',    , handleSubmitSalary', ', handleSubmitSalary');
code = code.replace(/,\s*,/g, ',');
fs.writeFileSync('src/components/payroll/CreateSalaryPayroll.tsx', code, 'utf-8');
console.log('fixed comma');
