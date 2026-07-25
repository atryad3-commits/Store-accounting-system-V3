const fs = require('fs');
const file = 'src/components/products/ProductsTab.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /setShowProductBarcodesList\(true\);/,
  'setPrintingBarcodeProduct(products.filter(p => selectedProductIds.includes(p.id)));'
);

fs.writeFileSync(file, content);
