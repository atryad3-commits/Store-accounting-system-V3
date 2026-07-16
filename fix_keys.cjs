const fs = require('fs');

function fixKeys(filePath) {
  let code = fs.readFileSync(filePath, 'utf-8');
  code = code.replace(/key=\{cb\.id\}/g, 'key={cb.id || `cb-${Math.random()}`}');
  code = code.replace(/key=\{inv\.id\}/g, 'key={inv.id || `inv-${Math.random()}`}');
  fs.writeFileSync(filePath, code, 'utf-8');
}

fixKeys('src/components/financial/PayReceiptModal.tsx');
fixKeys('src/components/financial/ReceiveReceiptModal.tsx');
console.log('keys fixed');
