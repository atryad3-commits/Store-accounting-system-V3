const fs = require('fs');
let code = fs.readFileSync('src/components/inventory/FastStocktakingMobile.tsx', 'utf-8');
code = code.replace(/import\s*\{\s*getStocktakings/g, 'import { getProductCategories, getStocktakings');
fs.writeFileSync('src/components/inventory/FastStocktakingMobile.tsx', code, 'utf-8');
console.log('Fixed import 2');
