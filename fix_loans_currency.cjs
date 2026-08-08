const fs = require('fs');

// Modify LoansManager.tsx
let managerCode = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');
managerCode = managerCode.replace(/<LoansDashboard formatCurrency={formatCurrency} loans={loans} installments={installments} persons={persons} \/>/g, '<LoansDashboard formatCurrency={formatCurrency} loans={loans} installments={installments} persons={persons} storeSettings={storeSettings} />');
managerCode = managerCode.replace(/<LoansArrears \n\s*loans={loans}\n\s*installments={installments}\n\s*persons={persons}\n\s*formatCurrency={formatCurrency}\n\s*\/>/g, '<LoansArrears \n             loans={loans}\n             installments={installments}\n             persons={persons}\n             formatCurrency={formatCurrency}\n             storeSettings={storeSettings}\n           />');
managerCode = managerCode.replace(/<LoansReports \n\s*loans={loans}\n\s*installments={installments}\n\s*persons={persons}\n\s*formatCurrency={formatCurrency}\n\s*\/>/g, '<LoansReports \n             loans={loans}\n             installments={installments}\n             persons={persons}\n             formatCurrency={formatCurrency}\n             storeSettings={storeSettings}\n           />');
// Pass addTransaction to LoansPayment
managerCode = managerCode.replace(/<LoansPayment\n\s*loans={loans}\n\s*installments={installments}\n\s*persons={persons}\n\s*formatCurrency={formatCurrency}\n\s*setInstallments={setInstallments}\n\s*showNotification={showNotification}\n\s*saveInstallments={saveInstallments}\n\s*addSystemLog={addSystemLog}\n\s*\/>/g, '<LoansPayment\n             loans={loans}\n             installments={installments}\n             persons={persons}\n             formatCurrency={formatCurrency}\n             setInstallments={setInstallments}\n             showNotification={showNotification}\n             saveInstallments={saveInstallments}\n             addSystemLog={addSystemLog}\n             addTransaction={addTransaction}\n             storeSettings={storeSettings}\n           />');
fs.writeFileSync('src/components/loans/LoansManager.tsx', managerCode);

// Modify LoansArrears.tsx
let arrearsCode = fs.readFileSync('src/components/loans/LoansArrears.tsx', 'utf8');
arrearsCode = arrearsCode.replace(/interface Props {/g, 'interface Props {\n  storeSettings?: any;');
arrearsCode = arrearsCode.replace(/export default function LoansArrears\(\{ loans, installments, persons, formatCurrency \}: Props\) {/g, 'export default function LoansArrears({ loans, installments, persons, formatCurrency, storeSettings }: Props) {');
arrearsCode = arrearsCode.replace(/\(واحد پول\)/g, '${storeSettings?.currency || "تومان"}');
arrearsCode = arrearsCode.replace(/مبلغ معوق \${storeSettings\?\.currency \|\| "تومان"}/g, 'مبلغ معوق ({storeSettings?.currency || "تومان"})');
fs.writeFileSync('src/components/loans/LoansArrears.tsx', arrearsCode);

// Modify LoansReports.tsx
let reportsCode = fs.readFileSync('src/components/loans/LoansReports.tsx', 'utf8');
reportsCode = reportsCode.replace(/interface Props {/g, 'interface Props {\n  storeSettings?: any;');
reportsCode = reportsCode.replace(/export default function LoansReports\(\{ loans, installments, persons, formatCurrency \}: Props\) {/g, 'export default function LoansReports({ loans, installments, persons, formatCurrency, storeSettings }: Props) {');
reportsCode = reportsCode.replace(/\(واحد پول\)/g, '({storeSettings?.currency || "تومان"})');
fs.writeFileSync('src/components/loans/LoansReports.tsx', reportsCode);

// Modify LoansDashboard.tsx
let dashboardCode = fs.readFileSync('src/components/loans/LoansDashboard.tsx', 'utf8');
dashboardCode = dashboardCode.replace(/interface Props {/g, 'interface Props {\n  storeSettings?: any;');
dashboardCode = dashboardCode.replace(/export default function LoansDashboard\(\{ loans, installments, persons, formatCurrency \}: Props\) {/g, 'export default function LoansDashboard({ loans, installments, persons, formatCurrency, storeSettings }: Props) {');
dashboardCode = dashboardCode.replace(/\(واحد پول\)/g, '({storeSettings?.currency || "تومان"})');
fs.writeFileSync('src/components/loans/LoansDashboard.tsx', dashboardCode);
