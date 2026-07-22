const fs = require('fs');

const replaces = [
  { file: 'src/components/modals/EditReceiptModal.tsx', line: 74, text: "showNotification('لطفاً اطلاعات الزامی را تکمیل کنید.', 'error');" },
  { file: 'src/components/modals/EditReceiptModal.tsx', line: 80, text: "showNotification('لطفاً منبع مالی (بانک یا صندوق) را انتخاب کنید.', 'error');" },
  { file: 'src/components/modals/EditReceiptModal.tsx', line: 85, text: "showNotification('لطفاً مشخصات چک را کامل وارد نمایید.', 'error');" },
  { file: 'src/components/modals/EditReceiptModal.tsx', line: 126, text: "showNotification('خطا در ثبت تغییرات رسید.', 'error');" },

  { file: 'src/components/financial/CheckManagement.tsx', line: 29, text: "showNotification(msg, 'error');" },
  { file: 'src/components/financial/CheckManagement.tsx', line: 208, text: "showNotification('لطفاً اطلاعات ضروری را وارد کنید', 'error');" },
  { file: 'src/components/financial/CheckManagement.tsx', line: 253, text: "showNotification('لطفاً اطلاعات ضروری را وارد کنید', 'error');" },
  { file: 'src/components/financial/CheckManagement.tsx', line: 785, text: "showNotification('این چک بدون فرم رسید ثبت شده است و قابلیت ویرایش از طریق رسید را ندارد. در صورت نیاز آن را حذف کرده و مجدداً از طریق فرم رسید ثبت نمایید.', 'error');" },
  { file: 'src/components/financial/CheckManagement.tsx', line: 1054, text: "showNotification('این چک بدون فرم رسید ثبت شده است و قابلیت ویرایش از طریق رسید را ندارد. در صورت نیاز آن را حذف کرده و مجدداً از طریق فرم رسید ثبت نمایید.', 'error');" },

  { file: 'src/components/financial/FinancialTransfer.tsx', line: 35, text: "if (!fromId || !toId || !amount || amount <= 0) return showNotification('اطلاعات نامعتبر است', 'error');" },
  { file: 'src/components/financial/FinancialTransfer.tsx', line: 36, text: "if (fromType === toType && fromId === toId) return showNotification('مبدا و مقصد نمی‌تواند یکسان باشد', 'error');" },

  { file: 'src/components/inventory/FastStocktakingMobile.tsx', line: 120, text: "showNotification('تعداد نامعتبر است', 'error');" },
  { file: 'src/components/inventory/FastStocktakingMobile.tsx', line: 160, text: "showNotification('خطا در ذخیره اطلاعات', 'error');" },

  { file: 'src/components/loans/LoansManager.tsx', line: 110, text: "showNotification('لطفا تمام فیلدهای ضروری را پر کنید.', 'error');" },
  { file: 'src/components/loans/LoansManager.tsx', line: 117, text: "showNotification(err.message || 'تاریخ شروع خارج از سال مالی است.', 'error');" },
  { file: 'src/components/loans/LoansManager.tsx', line: 194, text: "showNotification(err.message || 'خطا در ذخیره وام', 'error');" },
  { file: 'src/components/loans/LoansManager.tsx', line: 214, text: "showNotification('اطلاعات پرداخت ناقص است.', 'error');" },
  { file: 'src/components/loans/LoansManager.tsx', line: 221, text: "showNotification(err.message || 'تاریخ خارج از سال مالی است.', 'error');" },
  { file: 'src/components/loans/LoansManager.tsx', line: 278, text: "showNotification(err.message || 'خطا در ثبت پرداخت', 'error');" },
  { file: 'src/components/loans/LoansManager.tsx', line: 730, text: "showNotification('لطفا حساب پرداخت/دریافت را انتخاب کنید', 'error');" },
];

let currentFile = '';
let lines = [];
for (const r of replaces) {
  if (currentFile !== r.file) {
    if (currentFile) fs.writeFileSync(currentFile, lines.join('\n'));
    currentFile = r.file;
    lines = fs.readFileSync(currentFile, 'utf8').split('\n');
  }
  // replace the line
  const oldLine = lines[r.line - 1];
  lines[r.line - 1] = oldLine.replace(/showNotification\(, 'error'\);|if \(!fromId .* return showNotification\(, 'error'\);|if \(!fromId \|\| !toId \|\| !amount \|\| amount <= 0\) return showNotification\(, 'error'\);|if \(fromType === toType && fromId === toId\) return showNotification\(, 'error'\);/, r.text);
}
if (currentFile) fs.writeFileSync(currentFile, lines.join('\n'));

