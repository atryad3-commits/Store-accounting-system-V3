const fs = require('fs');
const file = 'src/components/modals/AccountFormModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
content = content.replace(
  'import { addAccount, updateAccount } from "../../services/dataService";',
  'import { addAccount, updateAccount, addAccountingDocument, getLedgerAccounts, ensureLedgerAccount } from "../../services/dataService";'
);

// Format CurrencyInput
content = content.replace(
  'موجودی اولیه (تومان)',
  'موجودی اولیه ({storeSettings?.currency || "تومان"})'
);
content = content.replace(
  'placeholder="مثال: 1000000"',
  'placeholder="0"'
);

// Update handleSubmit
const submitStart = `      const isEdit = editingAccountId !== null;
      const payload = {
        bankName: newAccountBankName,
        branchName: newAccountBranchName,
        accountNumber: newAccountNumber,
        cardNumber: newAccountCardNumber,
        sheba: newAccountShebaNumber,
        shebaNumber: newAccountShebaNumber,
        initialBalance: Number(newAccountBalance) || 0,
        balance: Number(newAccountBalance) || 0,
        accountHolder: newAccountHolder,
      };

      if (isEdit) {
        await updateAccount(editingAccountId.toString(), payload as any);
      } else {
        await addAccount(payload as any);
      }`;
      
const submitReplacement = `      const isEdit = editingAccountId !== null;
      const payload = {
        bankName: newAccountBankName,
        branchName: newAccountBranchName,
        accountNumber: newAccountNumber,
        cardNumber: newAccountCardNumber,
        sheba: newAccountShebaNumber,
        shebaNumber: newAccountShebaNumber,
        initialBalance: Number(newAccountBalance) || 0,
        balance: Number(newAccountBalance) || 0,
        accountHolder: newAccountHolder,
      };

      let savedAccount;
      if (isEdit) {
        savedAccount = await updateAccount(editingAccountId.toString(), payload as any);
      } else {
        savedAccount = await addAccount(payload as any);
        
        if (payload.initialBalance > 0 && savedAccount?.accountingCode) {
           const accounts = await getLedgerAccounts();
           const openingBalanceTitle = "تراز افتتاحیه";
           let openingBalanceAcc = accounts.find(a => a.title === openingBalanceTitle);
           if (!openingBalanceAcc) {
              const newAccCode = '3999';
              await ensureLedgerAccount({ accountingCode: newAccCode }, '3', newAccCode, openingBalanceTitle, openingBalanceTitle, 'credit');
              const updatedAccs = await getLedgerAccounts();
              openingBalanceAcc = updatedAccs.find(a => a.title === openingBalanceTitle);
           }
           
           const bankAcc = (await getLedgerAccounts()).find(a => a.code === savedAccount.accountingCode);
           if (bankAcc && openingBalanceAcc) {
              await addAccountingDocument({
                  date: new Date().toISOString().split('T')[0],
                  description: \`ثبت موجودی اولیه حساب بانکی \${savedAccount.bankName}\`,
                  status: "approved",
                  sourceType: "manual",
                  items: [
                     {
                        ledgerAccountId: String(bankAcc.id),
                        detailedAccountId: "",
                        description: "موجودی اولیه حساب",
                        debit: payload.initialBalance,
                        credit: 0
                     },
                     {
                        ledgerAccountId: String(openingBalanceAcc.id),
                        detailedAccountId: "",
                        description: "تراز افتتاحیه",
                        debit: 0,
                        credit: payload.initialBalance
                     }
                  ]
              });
           }
        }
      }`;

content = content.replace(submitStart, submitReplacement);
fs.writeFileSync(file, content);
