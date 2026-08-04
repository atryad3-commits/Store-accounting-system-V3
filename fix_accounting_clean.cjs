const fs = require('fs');
let file = fs.readFileSync('src/services/accountingService.ts', 'utf8');

file = file.replace(/\/\/ old code starts here:[\s\S]*?\};\n/g, '};\n');

fs.writeFileSync('src/services/accountingService.ts', file);
