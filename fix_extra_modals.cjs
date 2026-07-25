const fs = require('fs');
const file = 'src/components/modals/ExtraModals.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'onSubmit={handleReceiptSubmit}',
  'handleSubmitReceipt={handleReceiptSubmit}'
);

content = content.replace(
  'submitting={submittingReceipt}',
  'submittingReceipt={submittingReceipt}'
);

content = content.replace(
  'onSubmit={handleReceiptSubmit}',
  'handleSubmitReceipt={handleReceiptSubmit}'
);

content = content.replace(
  'submitting={submittingReceipt}',
  'submittingReceipt={submittingReceipt}'
);

fs.writeFileSync(file, content);
