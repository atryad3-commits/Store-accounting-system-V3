const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'setPreviewReceiptData={setPreviewReceiptData}',
  'setPreviewReceiptData={setPreviewReceiptData} setPrintingTransaction={setPrintingTransaction}'
);

fs.writeFileSync(file, content);
