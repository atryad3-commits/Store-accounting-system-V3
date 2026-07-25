const fs = require('fs');
const file = 'src/components/persons/PersonLedger.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'setPreviewReceiptData,',
  'setPreviewReceiptData,\n    setPrintingTransaction,'
);

fs.writeFileSync(file, content);
