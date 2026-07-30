const fs = require('fs');
let code = fs.readFileSync('src/services/productService.ts', 'utf8');

code = code.replace(
  "const newProduct = { ...product, code: newCode, id: generateId(), createdAt: now, updatedAt: now };",
  "const newProduct = { ...product, code: newCode, id: product.id || generateId(), createdAt: now, updatedAt: now };"
);

fs.writeFileSync('src/services/productService.ts', code);
console.log('patched productService');
