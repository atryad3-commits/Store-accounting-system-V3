const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add formatNumber={formatNumber} to ReceiveReceiptModal
code = code.replace(
  '<ReceiveReceiptModal',
  '<ReceiveReceiptModal formatNumber={formatNumber}'
);

// Add formatNumber={formatNumber} to PayReceiptModal
code = code.replace(
  '<PayReceiptModal',
  '<PayReceiptModal formatNumber={formatNumber}'
);

fs.writeFileSync('src/App.tsx', code, 'utf-8');

let receiveCode = fs.readFileSync('src/components/financial/ReceiveReceiptModal.tsx', 'utf-8');
receiveCode = receiveCode.replace('key={c.id}', 'key={c.id || Math.random().toString()}');
fs.writeFileSync('src/components/financial/ReceiveReceiptModal.tsx', receiveCode, 'utf-8');

let payCode = fs.readFileSync('src/components/financial/PayReceiptModal.tsx', 'utf-8');
payCode = payCode.replace('key={c.id}', 'key={c.id || Math.random().toString()}');
fs.writeFileSync('src/components/financial/PayReceiptModal.tsx', payCode, 'utf-8');

console.log('patched formatNumber and keys');
