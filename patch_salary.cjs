const fs = require('fs');
let code = fs.readFileSync('src/components/payroll/CreateSalaryPayroll.tsx', 'utf-8');

code = code.replace(
  'DollarSign, User, UserPlus, Save, RefreshCw, FileSpreadsheet',
  ''
);

code = code.replace(
  ', Calendar',
  ''
);

code = code.replace(
  ', PlusCircle',
  ''
);

code = code.replace(
  ', MinusCircle',
  ''
);

fs.writeFileSync('src/components/payroll/CreateSalaryPayroll.tsx', code, 'utf-8');
console.log('patched salary');
