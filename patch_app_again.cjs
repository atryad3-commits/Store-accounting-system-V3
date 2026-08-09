const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const startIndex = content.indexOf('<Route path="/loans" element={<LoansManager');
if (startIndex !== -1) {
    const endIndex = content.indexOf('/>} />', startIndex) + 6;
    if (endIndex > startIndex) {
        const oldStr = content.substring(startIndex, endIndex);
        console.log("Replacing: ", oldStr);
        
        const loansProps = `showNotification={showNotification} persons={persons} accounts={accounts} loans={loans} setLoans={setLoans} installments={installments} setInstallments={setInstallments} currentUser={user?.name || "کاربر سیستم"} userRole={user?.role} setAccounts={setAccounts} transactions={transactions} setTransactions={setTransactions} storeSettings={storeSettings}`;

        const newLoansRoutes = `
<Route path="/loans_dashboard" element={<LoansManager activeTab="dashboard" ${loansProps} />} />
<Route path="/loans_list" element={<LoansManager activeTab="list" ${loansProps} />} />
<Route path="/loans_create" element={<LoansManager activeTab="create" ${loansProps} />} />
<Route path="/loans_payment" element={<LoansManager activeTab="payment" ${loansProps} />} />
<Route path="/loans_arrears" element={<LoansManager activeTab="arrears" ${loansProps} />} />
<Route path="/loans_reports" element={<LoansManager activeTab="reports" ${loansProps} />} />
<Route path="/loans_settings" element={<LoansManager activeTab="settings" ${loansProps} />} />
`;
        content = content.substring(0, startIndex) + newLoansRoutes + content.substring(endIndex);
        fs.writeFileSync('src/App.tsx', content);
    }
} else {
    console.log("Could not find <Route path=\"/loans\"");
}
