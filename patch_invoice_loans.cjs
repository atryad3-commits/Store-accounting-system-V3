const fs = require('fs');
let code = fs.readFileSync('src/services/invoiceService.ts', 'utf8');

const targetAddTx = `     if (transaction.personId) {
        const persons = await getLocalData<any[]>('persons', []);
        const person = persons.find(p => String(p.id) === String(transaction.personId));
        if (person) {
           personName = person.name || person.alias || 'نامشخص';
           if (person.accountingCode) {
              const acc = ledgerAccounts.find(a => a.code === person.accountingCode);
              if (acc) personLedgerId = acc.id;
           }
        }
     }`;

const newAddTx = `     if (transaction.personId) {
        const persons = await getLocalData<any[]>('persons', []);
        const person = persons.find(p => String(p.id) === String(transaction.personId));
        if (person) {
           personName = person.name || person.alias || 'نامشخص';
           if (person.accountingCode) {
              const acc = ledgerAccounts.find(a => a.code === person.accountingCode);
              if (acc) personLedgerId = acc.id;
           }
        }
     }
     
     // Override personLedgerId for Loan transactions to proper Loan Accounts
     const getAccountForCode = async (code: string, title: string, parentCode: string, nature: 'debit' | 'credit') => {
        let acc = ledgerAccounts.find(a => a.code === code);
        if (acc) return acc.id;
        const parentAcc = ledgerAccounts.find(a => a.code === parentCode);
        if (parentAcc) {
            const newAcc = { id: generateId(), code, title, type: 'subsidiary', nature, parentId: parentAcc.id };
            const { addLedgerAccount } = require('./accountingService');
            await addLedgerAccount(newAcc);
            ledgerAccounts.push(newAcc);
            return newAcc.id;
        }
        return defaultLedger;
     };

     if (transaction.categoryId === 'loan_given' || transaction.categoryId === 'loan_installment_received') {
        personLedgerId = await getAccountForCode('1601', 'وام‌های پرداختی', '16', 'debit');
     } else if (transaction.categoryId === 'loan_received' || transaction.categoryId === 'loan_installment_paid') {
        personLedgerId = await getAccountForCode('2201', 'وام‌های دریافتی', '22', 'credit');
     }`;

code = code.replace(targetAddTx, newAddTx);

const targetUpTx = `         if (updated.personId) {
            const persons = await getLocalData<any[]>('persons', []);
            const person = persons.find(p => String(p.id) === String(updated.personId));
            if (person) {
               personName = person.name || person.alias || 'نامشخص';
               if (person.accountingCode) {
                  const acc = ledgerAccounts.find(a => a.code === person.accountingCode);
                  if (acc) personLedgerId = acc.id;
               }
            }
         }`;

const newUpTx = `         if (updated.personId) {
            const persons = await getLocalData<any[]>('persons', []);
            const person = persons.find(p => String(p.id) === String(updated.personId));
            if (person) {
               personName = person.name || person.alias || 'نامشخص';
               if (person.accountingCode) {
                  const acc = ledgerAccounts.find(a => a.code === person.accountingCode);
                  if (acc) personLedgerId = acc.id;
               }
            }
         }
         
         const getAccountForCode2 = async (code: string, title: string, parentCode: string, nature: 'debit' | 'credit') => {
            let acc = ledgerAccounts.find(a => a.code === code);
            if (acc) return acc.id;
            const parentAcc = ledgerAccounts.find(a => a.code === parentCode);
            if (parentAcc) {
                const newAcc = { id: generateId(), code, title, type: 'subsidiary', nature, parentId: parentAcc.id };
                const { addLedgerAccount } = require('./accountingService');
                await addLedgerAccount(newAcc);
                ledgerAccounts.push(newAcc);
                return newAcc.id;
            }
            return defaultLedger;
         };

         if (updated.categoryId === 'loan_given' || updated.categoryId === 'loan_installment_received') {
            personLedgerId = await getAccountForCode2('1601', 'وام‌های پرداختی', '16', 'debit');
         } else if (updated.categoryId === 'loan_received' || updated.categoryId === 'loan_installment_paid') {
            personLedgerId = await getAccountForCode2('2201', 'وام‌های دریافتی', '22', 'credit');
         }`;

code = code.replace(targetUpTx, newUpTx);

fs.writeFileSync('src/services/invoiceService.ts', code);
