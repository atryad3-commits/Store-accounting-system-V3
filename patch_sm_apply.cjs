const fs = require('fs');
let code = fs.readFileSync('src/services/loanStateMachine.ts', 'utf8');

const oldLogic = `  } else if (eligibility.direction === 'rollback' && fromStatus === 'active') {
    // Reverse Accounting doc & Delete transaction
    const transactionId = \`txn-loan-\${loan.id}\`;
    await deleteTransaction(transactionId);
    
    const docs = await getAccountingDocuments();
    const docToReverse = docs.find(d => d.sourceType === 'loan' && d.sourceId === loan.id && d.status === 'approved');
    
    if (docToReverse) {
       // Mark original as rejected/reversed
       await updateAccountingDocument(docToReverse.id, { ...docToReverse, status: 'rejected', description: docToReverse.description + ' (ابطال شده)' });
       
       // Create reverse document
       const reversedItems = docToReverse.items.map((item: any) => ({
           ...item,
           debit: item.credit,
           credit: item.debit,
           description: \`معکوس: \${item.description}\`
       }));
       
       await addAccountingDocument({
           date: new Date().toLocaleDateString('fa-IR').replace(/\\//g, '-'),
           description: \`سند اصلاحی بازگشت وضعیت وام \${loan.loanNumber || loan.id}\`,
           status: 'approved',
           sourceType: 'loan_reversal',
           sourceId: loan.id,
           items: reversedItems
       });
    }
  }`;

const newLogic = `  } else if (eligibility.direction === 'rollback' && fromStatus === 'active') {
    // Reverse Accounting doc & Add reverse transaction instead of deleting
    const reverseTransaction = {
        id: \`txn-rev-loan-\${loan.id}-\${Date.now()}\`,
        accountId: loan.accountId,
        type: loan.type === 'given' ? 'deposit' : 'withdrawal',
        amount: Number(loan.amount),
        date: new Date().toISOString().split('T')[0],
        description: \`برگشت تراکنش وام شماره \${loan.loanNumber || loan.id}\`,
        personId: loan.personId,
        categoryId: 'loan_reversal',
        createdAt: new Date().toISOString(), 
        skipAccounting: true
    };
    await addTransaction(reverseTransaction as any);
    
    const docs = await getAccountingDocuments();
    const docToReverse = docs.find(d => d.sourceType === 'loan' && d.sourceId === loan.id && d.status === 'approved');
    
    if (docToReverse) {
       // DO NOT modify or delete the original document so history remains intact
       
       // Create reverse document
       const reversedItems = docToReverse.items.map((item: any) => ({
           ...item,
           debit: item.credit,
           credit: item.debit,
           description: \`معکوس: \${item.description}\`
       }));
       
       await addAccountingDocument({
           date: new Date().toISOString().split('T')[0],
           description: \`سند اصلاحی بازگشت وضعیت وام \${loan.loanNumber || loan.id}\`,
           status: 'approved',
           sourceType: 'loan_reversal',
           sourceId: loan.id,
           items: reversedItems
       });
    }
  }`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('src/services/loanStateMachine.ts', code);
