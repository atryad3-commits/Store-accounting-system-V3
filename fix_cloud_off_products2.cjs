const fs = require('fs');
let code = fs.readFileSync('src/components/products/ProductsTab.tsx', 'utf8');

code = code.replace(
  "import { Menu } from 'lucide-react';",
  "import { Menu, CloudOff } from 'lucide-react';"
);

fs.writeFileSync('src/components/products/ProductsTab.tsx', code);
console.log('Fixed ProductsTab import for real');
