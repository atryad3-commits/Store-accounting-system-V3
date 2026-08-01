const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// Import AccountLedgerReport
if (!content.includes('AccountLedgerReport')) {
  content = content.replace(
    "import FinancialDashboard from './components/financial/FinancialDashboard';",
    "import FinancialDashboard from './components/financial/FinancialDashboard';\nimport AccountLedgerReport from './components/accounting/AccountLedgerReport';"
  );
}

// Add Route
if (!content.includes('path="/account_ledger"')) {
  const routeCode = `  <Route path="/account_ledger" element={<AccountLedgerReport
                        showNotification={showNotification}
                        onNavigateToDoc={(docId: any) => {
                          const doc = accountingDocuments.find(d => d.id.toString() === docId.toString());
                          if (doc) {
                             setViewingAccountingDoc(doc);
                             setIsAccountingDocModalOpen(true);
                          }
                        }}
                      />} />`;
                      
  content = content.replace(
    '<Route path="/financial_report" element={<FinancialDashboard',
    routeCode + '\n  <Route path="/financial_report" element={<FinancialDashboard'
  );
}

fs.writeFileSync(file, content);
