const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldSubmitEnd = `      }

      await fetchDataSilent();`;

const newSubmitEnd = `      }

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
        }
      }

      await fetchDataSilent();`;

if (code.includes(oldSubmitEnd)) {
  code = code.replace(oldSubmitEnd, newSubmitEnd);
  fs.writeFileSync('src/App.tsx', code, 'utf-8');
  console.log('Patched App.tsx handleSubmitPerson');
} else {
  console.log('Could not find pattern in App.tsx');
}
