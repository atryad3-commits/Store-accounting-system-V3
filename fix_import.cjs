const fs = require('fs');
let code = fs.readFileSync('src/components/inventory/FastStocktakingMobile.tsx', 'utf-8');
code = code.replace('addProduct } from "../../services/dataService";', 'addProduct, getProductCategories } from "../../services/dataService";');
fs.writeFileSync('src/components/inventory/FastStocktakingMobile.tsx', code, 'utf-8');
console.log('Fixed import');
