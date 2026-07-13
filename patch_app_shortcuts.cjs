const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  'setActiveTab("create_receive_receipt");\n                  setIsComposeOpen(false);',
  'setIsReceiveModalOpen(true);\n                  setIsComposeOpen(false);'
);

content = content.replace(
  'setActiveTab("create_pay_receipt");\n                  setIsComposeOpen(false);',
  'setIsPayModalOpen(true);\n                  setIsComposeOpen(false);'
);

fs.writeFileSync('src/App.tsx', content);
