const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/setNewProductPrice\(p\.price\.toString\(\)\);/g, 'setNewProductPrice(p.price?.toString() || "");');
fs.writeFileSync('src/App.tsx', code, 'utf-8');
console.log('Fixed App.tsx');
