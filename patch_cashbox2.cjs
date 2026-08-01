const fs = require('fs');
const file = 'src/components/modals/CashboxFormModal.tsx';
let content = fs.readFileSync(file, 'utf8');

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

// Payload
content = content.replace(
  'manager: newCashboxManager,',
  'manager: newCashboxManager,\n        accountNumber: newCashboxAccountNumber,'
);

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
