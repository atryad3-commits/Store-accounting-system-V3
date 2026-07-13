const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(
  '<ReceiptsList\n             transactions={transactions}',
  '<ReceiptsList\n             setIsReceiveModalOpen={setIsReceiveModalOpen}\n             setIsPayModalOpen={setIsPayModalOpen}\n             transactions={transactions}'
);
fs.writeFileSync('src/App.tsx', content);

let childContent = fs.readFileSync('src/components/financial/ReceiptsList.tsx', 'utf-8');
childContent = childContent.replace(
  'setActiveTab, invoiceSearchQuery',
  'setActiveTab, setIsReceiveModalOpen, setIsPayModalOpen, invoiceSearchQuery'
);
childContent = childContent.replace(
  'onClick={() => setActiveTab(isReceive ? "receive_receipt" : "pay_receipt")}',
  'onClick={() => { if (isReceive) { setIsReceiveModalOpen?.(true); } else { setIsPayModalOpen?.(true); } }}'
);
fs.writeFileSync('src/components/financial/ReceiptsList.tsx', childContent);
