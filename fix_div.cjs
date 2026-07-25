const fs = require('fs');
const file = 'src/components/products/ProductsTab.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '</AnimatePresence>',
  '</AnimatePresence>\n                        </div>'
);

fs.writeFileSync(file, content);
