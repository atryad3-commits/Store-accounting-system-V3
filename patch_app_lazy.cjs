const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const AccountLedgerReport = React.lazy')) {
  content = content.replace(
    "const FinancialDashboard = React.lazy(() => import('./components/reports/FinancialDashboard'));",
    "const FinancialDashboard = React.lazy(() => import('./components/reports/FinancialDashboard'));\nconst AccountLedgerReport = React.lazy(() => import('./components/accounting/AccountLedgerReport'));"
  );
  fs.writeFileSync(file, content);
}
