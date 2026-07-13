const fs = require('fs');
let content = fs.readFileSync('src/components/persons/PersonsManager.tsx', 'utf-8');

content = content.replace(
  'setActiveTab(\n                                                            "create_receive_receipt",\n                                                          );',
  'setIsReceiveModalOpen?.(true);'
);

content = content.replace(
  'setActiveTab(\n                                                            "create_pay_receipt",\n                                                          );',
  'setIsPayModalOpen?.(true);'
);

fs.writeFileSync('src/components/persons/PersonsManager.tsx', content);
