const fs = require('fs');
let code = fs.readFileSync('src/services/productService.ts', 'utf8');

code = code.replace(
  "const newCategory = { ...category, code: catCode, id: generateId(), createdAt: now, updatedAt: now };",
  "const newCategory = { ...category, code: catCode, id: category.id || generateId(), createdAt: now, updatedAt: now };"
);

fs.writeFileSync('src/services/productService.ts', code);
console.log('patched productService category');
