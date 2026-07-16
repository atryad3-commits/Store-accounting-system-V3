const fs = require('fs');
let code = fs.readFileSync('src/components/payroll/CreateSalaryPayroll.tsx', 'utf-8');

const importStart = code.indexOf('import {');
const importEnd = code.indexOf("} from 'lucide-react';");

if (importStart !== -1 && importEnd !== -1) {
  let imports = code.slice(importStart, importEnd);
  const neededIcons = ['Calendar', 'PlusCircle', 'MinusCircle'];
  for (const icon of neededIcons) {
    if (!imports.includes(icon)) {
      imports += `, ${icon}`;
    }
  }
  code = code.slice(0, importStart) + imports + code.slice(importEnd);
  fs.writeFileSync('src/components/payroll/CreateSalaryPayroll.tsx', code, 'utf-8');
  console.log('Fixed imports');
}
