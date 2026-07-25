const fs = require('fs');
const file = 'src/components/accounts/CashboxesManager.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
`                        onClick={() => {
                          setEditingCashboxId(null);
                          setNewCashboxName("");
                          setNewCashboxManager("");
                          setNewCashboxBalance("");
                          setIsCashboxModalOpen(true);
                        }}`,
`                        onClick={() => {
                          setEditingCashboxId(null);
                          setIsCashboxModalOpen(true);
                        }}`
);
fs.writeFileSync(file, content);
