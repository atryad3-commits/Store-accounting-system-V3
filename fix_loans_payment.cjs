const fs = require('fs');

let code = fs.readFileSync('src/components/loans/LoansPayment.tsx', 'utf8');

code = code.replace(/interface Props {/g, `interface Props {
  addTransaction?: (tx: any) => Promise<any>;
  storeSettings?: any;`);

code = code.replace(/export default function LoansPayment\(\{ loans, installments, persons, formatCurrency, setInstallments, showNotification, saveInstallments, addSystemLog \}: Props\) {/g, `export default function LoansPayment({ loans, installments, persons, formatCurrency, setInstallments, showNotification, saveInstallments, addSystemLog, addTransaction, storeSettings }: Props) {`);

let handlePayCode = `  const handlePay = async (inst: Installment) => {
    try {
      const updatedInsts = installments.map(i => {
        if (i.id === inst.id) {
          return { ...i, status: 'paid', paidDate: new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-'), paidAmount: i.amount } as Installment;
        }
        return i;
      });
      setInstallments(updatedInsts);
      await saveInstallments(updatedInsts);
      await addSystemLog('PAY_INSTALLMENT', \`پرداخت قسط \${inst.installmentNumber || ''} وام \${selectedLoan?.loanNumber || selectedLoan?.id}\`, 'Installment', inst.id);
      
      if (addTransaction && selectedLoan) {
        const txType = selectedLoan.type === 'given' ? 'receive' : 'pay';
        await addTransaction({
          type: txType,
          amount: inst.amount,
          accountId: selectedLoan.accountId || '',
          personId: selectedLoan.personId,
          categoryId: selectedLoan.type === 'given' ? 'loan_installment_receive' : 'loan_installment_pay',
          description: \`دریافت قسط \${inst.installmentNumber || ''} وام \${selectedLoan.loanNumber || selectedLoan.id}\`,
          date: new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-'),
          time: new Date().toLocaleTimeString('fa-IR', { hour12: false }),
          isSystem: true,
        });
      }

      showNotification('قسط با موفقیت پرداخت شد.', 'success');
    } catch(err) {
      showNotification('خطا در پرداخت قسط', 'error');
    }
  };`;

// We must precisely replace handlePay block
code = code.replace(/const handlePay = async \(inst: Installment\) => \{[\s\S]*?showNotification\('خطا در پرداخت قسط', 'error'\);\s*\}\s*\};/, handlePayCode);

fs.writeFileSync('src/components/loans/LoansPayment.tsx', code);
