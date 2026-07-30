const fs = require('fs');
let code = fs.readFileSync('src/components/products/ProductsTab.tsx', 'utf8');

if (!code.includes('import { CloudOff }')) {
  code = code.replace(
    'import { motion, AnimatePresence } from "motion/react";',
    'import { motion, AnimatePresence } from "motion/react";\nimport { CloudOff } from "lucide-react";'
  );
  fs.writeFileSync('src/components/products/ProductsTab.tsx', code);
  console.log('Fixed ProductsTab import');
}
