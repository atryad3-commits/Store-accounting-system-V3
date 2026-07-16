const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldSubmitBlock = `      // Auto-select the newly created person in active creation forms
      if (!isEdit && addedPerson?.id) {
        if (isReceiveModalOpen || isPayModalOpen) {
          setReceiptPersonId(addedPerson.id.toString());
        } else if (
          activeTab === "create_sale" || 
          activeTab === "create_purchase" || 
          activeTab === "create_sale_return" || 
          activeTab === "create_purchase_return" || 
          activeTab === "create_warehouse_doc"
        ) {
          setCustomerId(addedPerson.id.toString());
        }
      }`;

const newSubmitBlock = `      // Auto-select the newly created person in active creation forms
      if (!isEdit && addedPerson?.id) {
        if (isReceiveModalOpen || isPayModalOpen) {
          setReceiptPersonId(addedPerson.id.toString());
        } else if (
          activeTab === "create_sale" || 
          activeTab === "create_purchase" || 
          activeTab === "create_sale_return" || 
          activeTab === "create_purchase_return" || 
          activeTab === "create_warehouse_doc"
        ) {
          setCustomerId(addedPerson.id.toString());
        } else if (activeTab === "create_salary_payroll") {
          setSalaryPersonId(addedPerson.id.toString());
        }
      }`;

if (code.includes(oldSubmitBlock)) {
  code = code.replace(oldSubmitBlock, newSubmitBlock);
  fs.writeFileSync('src/App.tsx', code, 'utf-8');
  console.log('Patched App.tsx handleSubmitPerson with salaryPersonId');
} else {
  console.log('Could not find pattern in App.tsx');
}
