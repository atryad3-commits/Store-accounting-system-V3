const fs = require('fs');
let content = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');
console.log(content.includes('p.isActive !== false && (p.barcode === code || p.code === code)'));
