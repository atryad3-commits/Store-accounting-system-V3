const fs = require('fs');
let code = fs.readFileSync('src/components/payroll/CreateSalaryPayroll.tsx', 'utf-8');

// Find the destructuring block
const start = code.indexOf('const {');
const end = code.indexOf('} = props;', start);
if (start !== -1 && end !== -1) {
  let inner = code.slice(start + 7, end);
  
  // Replace known icons
  const iconsToRemove = [
    'DollarSign', 'User', 'UserPlus', 'Save', 'RefreshCw', 'FileSpreadsheet', 
    'Calendar', 'PlusCircle', 'MinusCircle', 'Info', 'Wallet', 'CheckCircle', 
    'FileText', 'Tag', 'AlertCircle', 'Package', 'ScanLine', 'Box', 'ArrowLeft', 
    'Minus', 'Edit2', 'Printer', 'Search', 'Calculator', 'Briefcase', 'Banknote'
  ];
  
  iconsToRemove.forEach(icon => {
    // regex to match the icon word surrounded by word boundaries or commas
    const regex = new RegExp(`\\b${icon}\\b\\s*,?`, 'g');
    inner = inner.replace(regex, '');
  });
  
  code = code.slice(0, start + 7) + inner + code.slice(end);
  fs.writeFileSync('src/components/payroll/CreateSalaryPayroll.tsx', code, 'utf-8');
  console.log('cleaned destructuring');
}
