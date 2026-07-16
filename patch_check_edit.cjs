const fs = require('fs');
let code = fs.readFileSync('src/components/financial/CheckManagement.tsx', 'utf-8');

// We need to add a new prop to CheckManagement: onEditReceiptByCheck
code = code.replace(
  /export default function CheckManagement\(props: any\) {/g,
  `export default function CheckManagement(props: any) {
  const { onEditReceiptByCheck } = props;`
);

// We find the onClick for Edit Issued Check
const oldIssuedEdit = `                                onClick={() => {
                                  setEditingIssuedCheckId(c.id);
                                  setIcCheckbookId(String(c.checkbookId || ''));
                                  setIcCheckNumber(c.checkNumber);
                                  setIcPayeeId(String(c.payeeId || ''));
                                  setIcAmount(c.amount.toString());
                                  setIcIssueDate(c.issueDate);
                                  setIcDueDate(c.dueDate);
                                  setIcDescription(c.description || '');
                                  setIsIssuedModalOpen(true);
                                }}`;

const newIssuedEdit = `                                onClick={() => {
                                  if (c.receiptNumber && onEditReceiptByCheck) {
                                    onEditReceiptByCheck(c, 'issued');
                                  } else {
                                    alert("این چک بدون فرم رسید ثبت شده است و قابلیت ویرایش از طریق رسید را ندارد. در صورت نیاز آن را حذف کرده و مجدداً از طریق فرم رسید ثبت نمایید.");
                                  }
                                }}`;

// We find the onClick for Edit Received Check
const oldReceivedEdit = `                                onClick={() => {
                                  setEditingReceivedCheckId(c.id);
                                  setRcCheckNumber(c.checkNumber);
                                  setRcBankName(c.bankName);
                                  setRcBranchName(c.branchName || '');
                                  setRcPayerId(String(c.payerId || ''));
                                  setRcAmount(c.amount.toString());
                                  setRcReceiveDate(c.receiveDate);
                                  setRcDueDate(c.dueDate);
                                  setRcDescription(c.description || '');
                                  setIsReceivedModalOpen(true);
                                }}`;

const newReceivedEdit = `                                onClick={() => {
                                  if (c.receiptNumber && onEditReceiptByCheck) {
                                    onEditReceiptByCheck(c, 'received');
                                  } else {
                                    alert("این چک بدون فرم رسید ثبت شده است و قابلیت ویرایش از طریق رسید را ندارد. در صورت نیاز آن را حذف کرده و مجدداً از طریق فرم رسید ثبت نمایید.");
                                  }
                                }}`;

code = code.replace(oldIssuedEdit, newIssuedEdit);
code = code.replace(oldReceivedEdit, newReceivedEdit);

fs.writeFileSync('src/components/financial/CheckManagement.tsx', code, 'utf-8');
console.log('Patched CheckManagement.tsx');
