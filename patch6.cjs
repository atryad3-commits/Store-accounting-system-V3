const fs = require('fs');
let code = fs.readFileSync('src/components/inventory/StocktakingManager.tsx', 'utf-8');

code = code.replace(/handleAddProductToCounting\(newProduct\);\n\s*\}\);\n\s*\}\}/, "handleAddProductToCounting(newProduct);\n             });\n             return true;\n          }}");

fs.writeFileSync('src/components/inventory/StocktakingManager.tsx', code, 'utf-8');
console.log('patched6');
