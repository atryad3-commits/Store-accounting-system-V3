const fs = require('fs');
['LoansDashboard.tsx', 'LoansArrears.tsx', 'LoansReports.tsx'].forEach(file => {
  let path = 'src/components/loans/' + file;
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(/loans, installments, persons\r?\n\}:/g, 'loans, installments, persons, storeSettings\n}:');
  code = code.replace(/loans, installments, persons\}:/g, 'loans, installments, persons, storeSettings}:');
  fs.writeFileSync(path, code);
});
