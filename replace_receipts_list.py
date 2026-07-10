with open("src/App.tsx", "r") as f:
    app = f.read()

import_statement = "import ReceiptsList from './components/financial/ReceiptsList';\n"
app = import_statement + app

# Replace the block
import re

start_str = 'case "list_pay_receipt": {'
end_str = 'case "create_salary_payroll":'

start_idx = app.find(start_str)
end_idx = app.find(end_str)

replacement = """case "list_pay_receipt": {
        return (
          <ReceiptsList
             transactions={transactions} activeTab={activeTab} persons={persons} getPersonDisplayName={getPersonDisplayName} formatCurrency={formatCurrency} formatDateDisplay={formatDateDisplay} setViewingTransaction={setViewingTransaction} renderPersonLink={renderPersonLink} storeSettings={storeSettings}
          />
        );
      }
      """
      
app = app[:start_idx] + replacement + app[end_idx:]

with open("src/App.tsx", "w") as f:
    f.write(app)
