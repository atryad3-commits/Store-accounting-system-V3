const fs = require('fs');
let code = fs.readFileSync('src/components/inventory/StocktakingManager.tsx', 'utf-8');

code = code.replace(/onSuccess=\{async \(newProduct\) => \{/g, 'isOpen={true}\n          onSave={async (newProduct) => {');
code = code.replace(/setProductSearch\(''\);\n\s*handleAddProductToCounting\(newProduct\);\n\s*\}\}\n/g, "setProductSearch('');\n             handleAddProductToCounting(newProduct);\n             return true;\n          }}\n");

fs.writeFileSync('src/components/inventory/StocktakingManager.tsx', code, 'utf-8');
console.log('patched5');
