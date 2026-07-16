const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const handleEditReceiptByCheckFunc = `  const handleEditReceiptByCheck = (check: any, type: 'issued' | 'received') => {
    const txType = type === 'issued' ? 'pay' : 'receive';
    let tx;
    if (check.receiptNumber) {
      tx = transactions.find((t) => t.type === txType && t.receiptNumber === check.receiptNumber);
      if (!tx) {
        tx = transactions.find((t) => t.type === txType && t.method === 'check' && t.checkNumber === check.checkNumber);
      }
    } else {
      tx = transactions.find((t) => t.type === txType && t.method === 'check' && t.checkNumber === check.checkNumber);
    }
    
    if (tx) {
      setEditingReceipt(tx);
      setIsEditReceiptModalOpen(true);
    } else {
      customAlert("رسید مرتبط با این چک یافت نشد.");
    }
  };
`;

// Insert it before `const handleSaveReceipt = async (updatedFields: any) => {`
const searchTarget = `const handleSaveReceipt = async (updatedFields: any) => {`;
if (code.includes(searchTarget)) {
  code = code.replace(searchTarget, handleEditReceiptByCheckFunc + '\n  ' + searchTarget);
} else {
  console.log('Could not find handleSaveReceipt');
}

// Pass it to CheckManagement
const checkManagementRender = `<CheckManagement
                      showNotification={showNotification}`;

const checkManagementRenderNew = `<CheckManagement
                      onEditReceiptByCheck={handleEditReceiptByCheck}
                      showNotification={showNotification}`;

if (code.includes(checkManagementRender)) {
  code = code.replace(checkManagementRender, checkManagementRenderNew);
} else {
  console.log('Could not find CheckManagement render');
}

fs.writeFileSync('src/App.tsx', code, 'utf-8');
console.log('Patched App.tsx with handleEditReceiptByCheck');
