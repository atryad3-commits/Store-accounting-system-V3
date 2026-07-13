const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(
    '            initial={{ opacity: 0, y: 10 }}\n            animate={{ opacity: 1, y: 0 }}\n            className="space-y-6 text-right"\n          >',
    ''
  );
  fs.writeFileSync(file, content);
}

fixFile('src/components/financial/ReceiveReceiptModal.tsx');
fixFile('src/components/financial/PayReceiptModal.tsx');
