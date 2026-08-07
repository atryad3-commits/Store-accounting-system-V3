const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

// add formatCurrency to props
code = code.replace(
    /setTransactions: React\.Dispatch<React\.SetStateAction<any\[\]>>;\n\s*currentUser\?: string;/,
    `setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  formatCurrency?: (val: number) => string;
  currentUser?: string;`
);

code = code.replace(
    /setTransactions,\n\s*showNotification,/,
    `setTransactions,
  formatCurrency = (val: number) => Number(val).toLocaleString('fa-IR') + ' تومان',
  showNotification,`
);

// We need to find places where 'تومان' is hardcoded and replace with formatCurrency

// 1. {addCommas(loan.amount)} تومان -> formatCurrency(loan.amount)
code = code.replace(/\{addCommas\(([^)]+)\)\}\s*تومان/g, "{formatCurrency($1)}");
code = code.replace(/addCommas\(([^)]+)\)\s*\+\s*' تومان'/g, "formatCurrency($1)");
code = code.replace(/addCommas\(([^)]+)\)\s*\+\s*" تومان"/g, "formatCurrency($1)");

// Wait, LoansDashboard, LoansReports, LoansArrears are subcomponents imported in LoansManager!
// I need to pass formatCurrency to them too!
code = code.replace(
    /<LoansDashboard\n\s*loans=\{loans\}/g,
    `<LoansDashboard formatCurrency={formatCurrency} loans={loans}`
);
code = code.replace(
    /<LoansArrears\n\s*loans=\{loans\}/g,
    `<LoansArrears formatCurrency={formatCurrency} loans={loans}`
);
code = code.replace(
    /<LoansReports\n\s*loans=\{loans\}/g,
    `<LoansReports formatCurrency={formatCurrency} loans={loans}`
);
// wait, LoansDashboard could be inline: `<LoansDashboard loans={loans}`
code = code.replace(/<LoansDashboard/g, `<LoansDashboard formatCurrency={formatCurrency}`);
code = code.replace(/<LoansArrears/g, `<LoansArrears formatCurrency={formatCurrency}`);
code = code.replace(/<LoansReports/g, `<LoansReports formatCurrency={formatCurrency}`);

// We might have duplicated formatCurrency if it was replaced multiple times.
// Let's do it safer.

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
