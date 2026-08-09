const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldLoansRouteRegex = /<Route path="\/loans" element=\{<LoansManager showNotification=\{showNotification\} persons=\{persons\} accounts=\{accounts\}\s*loans=\{loans\}\s*setLoans=\{setLoans\}\s*installments=\{installments\}\s*setInstallments=\{setInstallments\}\s*currentUser=\{user\?.name \|\| "کاربر سیستم"\}\s*userRole=\{user\?.role \|\| "viewer"\}\s*\/>\} \/>/;

const loansProps = `showNotification={showNotification} persons={persons} accounts={accounts} loans={loans} setLoans={setLoans} installments={installments} setInstallments={setInstallments} currentUser={user?.name || "کاربر سیستم"} userRole={user?.role || "viewer"}`;

const newLoansRoutes = `
<Route path="/loans_dashboard" element={<LoansManager activeTab="dashboard" ${loansProps} />} />
<Route path="/loans_list" element={<LoansManager activeTab="list" ${loansProps} />} />
<Route path="/loans_create" element={<LoansManager activeTab="create" ${loansProps} />} />
<Route path="/loans_payment" element={<LoansManager activeTab="payment" ${loansProps} />} />
<Route path="/loans_arrears" element={<LoansManager activeTab="arrears" ${loansProps} />} />
<Route path="/loans_reports" element={<LoansManager activeTab="reports" ${loansProps} />} />
<Route path="/loans_settings" element={<LoansManager activeTab="settings" ${loansProps} />} />
`;

content = content.replace(oldLoansRouteRegex, newLoansRoutes);
fs.writeFileSync('src/App.tsx', content);
