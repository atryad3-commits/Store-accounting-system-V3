const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  'if (["create_receive_receipt", "create_pay_receipt"].includes(activeTab)) {',
  'if (isReceiveModalOpen || isPayModalOpen) {'
);

content = content.replace(
  'const docType = activeTab === "create_receive_receipt" ? "receive_receipt" : "pay_receipt";',
  'const docType = isReceiveModalOpen ? "receive_receipt" : "pay_receipt";'
);

fs.writeFileSync('src/App.tsx', content);
