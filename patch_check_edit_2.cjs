const fs = require('fs');
let code = fs.readFileSync('src/components/financial/CheckManagement.tsx', 'utf-8');

// 1. Update the export signature
const oldSig = `export default function CheckManagement({ showNotification, activeTab = 'checkbooks', onDataChange, currentUser = 'کاربر سیستم', sendNotification, storeSettings, setViewingCheck }: { showNotification?: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void, activeTab?: 'checkbooks' | 'issued_checks' | 'received_checks' | 'check_calendar' | 'check_charts' | 'check_panel', onDataChange?: () => void, currentUser?: string, sendNotification?: any, storeSettings?: any, setViewingCheck?: any }) {`;
const newSig = `export default function CheckManagement({ showNotification, activeTab = 'checkbooks', onDataChange, currentUser = 'کاربر سیستم', sendNotification, storeSettings, setViewingCheck, onEditReceiptByCheck }: { showNotification?: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void, activeTab?: 'checkbooks' | 'issued_checks' | 'received_checks' | 'check_calendar' | 'check_charts' | 'check_panel', onDataChange?: () => void, currentUser?: string, sendNotification?: any, storeSettings?: any, setViewingCheck?: any, onEditReceiptByCheck?: any }) {`;

if (code.includes(oldSig)) {
  code = code.replace(oldSig, newSig);
  console.log("Replaced signature.");
} else {
  console.log("Could not replace signature.");
}

// 2. Replace Issued edit button onClick
// Find: setEditingIssuedCheckId(c.id); ... setIsIssuedModalOpen(true);
const issuedEditRegex = /setEditingIssuedCheckId\(c\.id\);[\s\S]*?setIsIssuedModalOpen\(true\);/g;
code = code.replace(issuedEditRegex, `if (c.receiptNumber && onEditReceiptByCheck) {
                                    onEditReceiptByCheck(c, 'issued');
                                  } else {
                                    alert("این چک بدون فرم رسید ثبت شده است و قابلیت ویرایش از طریق رسید را ندارد. در صورت نیاز آن را حذف کرده و مجدداً از طریق فرم رسید ثبت نمایید.");
                                  }`);

// 3. Replace Received edit button onClick
const receivedEditRegex = /setEditingReceivedCheckId\(c\.id\);[\s\S]*?setIsReceivedModalOpen\(true\);/g;
code = code.replace(receivedEditRegex, `if (c.receiptNumber && onEditReceiptByCheck) {
                                    onEditReceiptByCheck(c, 'received');
                                  } else {
                                    alert("این چک بدون فرم رسید ثبت شده است و قابلیت ویرایش از طریق رسید را ندارد. در صورت نیاز آن را حذف کرده و مجدداً از طریق فرم رسید ثبت نمایید.");
                                  }`);

fs.writeFileSync('src/components/financial/CheckManagement.tsx', code, 'utf-8');
console.log('Patched CheckManagement.tsx buttons and signature.');
