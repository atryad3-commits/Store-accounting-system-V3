const fs = require('fs');
let code = fs.readFileSync('src/components/inventory/StocktakingManager.tsx', 'utf-8');

code = code.replace(/const updated = require\('\.\.\/\.\.\/services\/dataService'\)\.getProducts;/g, '');
code = code.replace(/updated\(\)\.then/g, 'getProducts().then');

fs.writeFileSync('src/components/inventory/StocktakingManager.tsx', code, 'utf-8');
console.log('patched4 successfully');
