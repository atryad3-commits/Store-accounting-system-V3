const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/setActiveTab\(\"create_receive_receipt\"\)/g, "setIsReceiveModalOpen?.(true)");
  content = content.replace(/setActiveTab\(\"create_pay_receipt\"\)/g, "setIsPayModalOpen?.(true)");
  
  if (file.includes('InvoicesList.tsx')) {
    content = content.replace(/setActiveTab,\n/g, "setActiveTab,\n    setIsReceiveModalOpen,\n    setIsPayModalOpen,\n");
  } else if (file.includes('PersonsManager.tsx')) {
    content = content.replace(/setActiveTab,\n/g, "setActiveTab,\n    setIsReceiveModalOpen,\n    setIsPayModalOpen,\n");
  } else if (file.includes('PersonLedgerActionsDropdown.tsx')) {
    content = content.replace(/setActiveTab,\n/g, "setActiveTab,\n  setIsReceiveModalOpen,\n  setIsPayModalOpen,\n");
  }
  
  fs.writeFileSync(file, content);
}

patchFile('src/components/invoices/InvoicesList.tsx');
patchFile('src/components/persons/PersonsManager.tsx');
patchFile('src/components/persons/PersonLedgerActionsDropdown.tsx');
