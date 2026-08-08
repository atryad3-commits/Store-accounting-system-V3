const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

// Add import
if (!code.includes('import LoansPayment')) {
  code = code.replace("import LoansSettings from './LoansSettings';", "import LoansSettings from './LoansSettings';\nimport LoansPayment from './LoansPayment';");
}

// Add tab button
const oldTabs = `<button
            onClick={() => setActiveTab('arrears')}`;
const newTabs = `<button
            onClick={() => setActiveTab('payment')}
            className={\`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 \${
              activeTab === 'payment' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }\`}
          >
            پرداخت اقساط
          </button>
          <button
            onClick={() => setActiveTab('arrears')}`;
code = code.replace(oldTabs, newTabs);

// Add tab content
const oldTabContent = `{activeTab === 'settings' && (
           <LoansSettings showNotification={showNotification} userRole={userRole} />
        )}`;
const newTabContent = `{activeTab === 'settings' && (
           <LoansSettings showNotification={showNotification} userRole={userRole} />
        )}
        {activeTab === 'payment' && (
           <LoansPayment
             loans={loans}
             installments={installments}
             persons={persons}
             formatCurrency={formatCurrency}
             setInstallments={setInstallments}
             showNotification={showNotification}
             saveInstallments={saveInstallments}
             addSystemLog={addSystemLog}
           />
        )}`;
code = code.replace(oldTabContent, newTabContent);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
