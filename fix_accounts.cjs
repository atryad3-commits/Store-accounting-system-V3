const fs = require('fs');
const file = 'src/components/accounts/AccountsManager.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
`                        onClick={() => {
                          setEditingAccountId(null);
                          setNewAccountBankName("");
                          setNewAccountBranchName("");
                          setNewAccountNumber("");
                          setNewAccountCardNumber("");
                          setNewAccountShebaNumber("");
                          setNewAccountBalance("");
                          setNewAccountHolder("");
                          setIsAccountModalOpen(true);
                        }}`,
`                        onClick={() => {
                          setEditingAccountId(null);
                          setIsAccountModalOpen(true);
                        }}`
);
fs.writeFileSync(file, content);
