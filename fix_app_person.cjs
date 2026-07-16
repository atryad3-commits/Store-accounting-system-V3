const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const personSubmitEnd = `      }

      await fetchDataSilent();
      setNewPersonTitle("");`;

const personSubmitEndNew = `      }

      // Auto-select the newly created person in active creation forms
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
      }

      await fetchDataSilent();
      setNewPersonTitle("");`;

if (code.includes(personSubmitEnd)) {
  code = code.replace(personSubmitEnd, personSubmitEndNew);
  fs.writeFileSync('src/App.tsx', code, 'utf-8');
  console.log('Fixed handleSubmitPerson');
} else {
  console.log('Could not find personSubmitEnd');
}
