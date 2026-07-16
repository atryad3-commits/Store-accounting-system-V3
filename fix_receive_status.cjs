const fs = require('fs');
let code = fs.readFileSync('src/components/financial/CheckManagement.tsx', 'utf-8');

const oldCheck = `if (!c.dueDate || c.status === 'cancelled') return false;`;
const newCheck = `if (!c.dueDate || c.status === 'returned') return false;`;

if (code.includes(oldCheck)) {
  code = code.replace(oldCheck, newCheck);
  fs.writeFileSync('src/components/financial/CheckManagement.tsx', code, 'utf-8');
  console.log('Fixed receive check status check');
}
