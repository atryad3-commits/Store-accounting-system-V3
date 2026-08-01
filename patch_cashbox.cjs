const fs = require('fs');
const file = 'src/components/modals/CashboxFormModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
content = content.replace(
  'import { addCashbox, updateCashbox } from "../../services/dataService";',
  'import { addCashbox, updateCashbox, addAccountingDocument, getLedgerAccounts, ensureLedgerAccount } from "../../services/dataService";'
);

// Add state
content = content.replace(
  'const [newCashboxManager, setNewCashboxManager] = useState("");',
  'const [newCashboxManager, setNewCashboxManager] = useState("");\n  const [newCashboxAccountNumber, setNewCashboxAccountNumber] = useState("");'
);

// Populate state
content = content.replace(
  'setNewCashboxManager(cb.manager || "");',
  'setNewCashboxManager(cb.manager || "");\n          setNewCashboxAccountNumber(cb.accountNumber || "");'
);
content = content.replace(
  'setNewCashboxManager("");',
  'setNewCashboxManager("");\n        setNewCashboxAccountNumber("");'
);
content = content.replace(
  'setNewCashboxManager("");\n      setNewCashboxBalance("");',
  'setNewCashboxManager("");\n      setNewCashboxAccountNumber("");\n      setNewCashboxBalance("");'
);

// Format CurrencyInput
content = content.replace(
  'موجودی اولیه (تومان)',
  'موجودی اولیه ({storeSettings?.currency || "تومان"})'
);
content = content.replace(
  'placeholder="مثال: 500000"',
  'placeholder="0"'
);

// Update handleSubmit
const submitStart = `      const isEdit = editingCashboxId !== null;
      const payload = {
        name: newCashboxName,
        manager: newCashboxManager,
        description: newCashboxManager, // For firebase checking description
        initialBalance: Number(newCashboxBalance) || 0,
        balance: Number(newCashboxBalance) || 0,
      };

      if (isEdit) {
        await updateCashbox(editingCashboxId.toString(), payload as any);
      } else {
        await addCashbox(payload as any);
      }`;
      
const submitReplacement = `      const isEdit = editingCashboxId !== null;
      const payload = {
        name: newCashboxName,
        manager: newCashboxManager,
        accountNumber: newCashboxAccountNumber,
        description: newCashboxManager, // For firebase checking description
        initialBalance: Number(newCashboxBalance) || 0,
        balance: Number(newCashboxBalance) || 0,
      };

      let savedCashbox;
      if (isEdit) {
        savedCashbox = await updateCashbox(editingCashboxId.toString(), payload as any);
      } else {
        savedCashbox = await addCashbox(payload as any);
        
        if (payload.initialBalance > 0 && savedCashbox?.accountingCode) {
           const accounts = await getLedgerAccounts();
           const openingBalanceTitle = "تراز افتتاحیه";
           let openingBalanceAcc = accounts.find(a => a.title === openingBalanceTitle);
           if (!openingBalanceAcc) {
              const newAccCode = '3999';
              await ensureLedgerAccount({ accountingCode: newAccCode }, '3', newAccCode, openingBalanceTitle, openingBalanceTitle, 'credit');
              const updatedAccs = await getLedgerAccounts();
              openingBalanceAcc = updatedAccs.find(a => a.title === openingBalanceTitle);
           }
           
           const cashboxAcc = (await getLedgerAccounts()).find(a => a.code === savedCashbox.accountingCode);
           if (cashboxAcc && openingBalanceAcc) {
              await addAccountingDocument({
                  date: new Date().toISOString().split('T')[0],
                  description: \`ثبت موجودی اولیه صندوق \${savedCashbox.name}\`,
                  status: "approved",
                  sourceType: "manual",
                  items: [
                     {
                        ledgerAccountId: String(cashboxAcc.id),
                        detailedAccountId: "",
                        description: "موجودی اولیه صندوق",
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

// Form input
const managerInput = `                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              مسئول صندوق (اختیاری)
                            </label>
                            <input
                              type="text"
                              value={newCashboxManager}
                              onChange={(e) =>
                                setNewCashboxManager(e.target.value)
                              }
                              placeholder="مثال: سارا احمدی"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900"
                            />
                          </div>`;
const newInputs = managerInput + `
                          <div className="w-full text-right">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              شماره حساب اختصاص داده شده (اختیاری)
                            </label>
                            <input
                              type="text"
                              value={newCashboxAccountNumber}
                              onChange={(e) =>
                                setNewCashboxAccountNumber(e.target.value)
                              }
                              placeholder="مثال: 123456789"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900 text-left"
                              dir="ltr"
                            />
                          </div>`;
content = content.replace(managerInput, newInputs);

fs.writeFileSync(file, content);
