const fs = require('fs');
let code = fs.readFileSync('src/components/crm/DebtorsTracking.tsx', 'utf-8');
code = code.replace(/\\n\\nfunction DroppableColumn/, '\n\nfunction DroppableColumn');
fs.writeFileSync('src/components/crm/DebtorsTracking.tsx', code, 'utf-8');
