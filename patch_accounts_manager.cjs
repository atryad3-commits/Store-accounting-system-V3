const fs = require('fs');
const file = 'src/components/accounts/AccountsManager.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'موجودی (تومان)',
  'موجودی ({storeSettings?.currency || "تومان"})'
);
fs.writeFileSync(file, content);
