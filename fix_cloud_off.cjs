const fs = require('fs');
let code = fs.readFileSync('src/components/persons/PersonsManager.tsx', 'utf8');

if (!code.includes('import { CloudOff }')) {
  code = code.replace(
    'import { motion, AnimatePresence } from "motion/react";',
    'import { motion, AnimatePresence } from "motion/react";\nimport { CloudOff } from "lucide-react";'
  );
  fs.writeFileSync('src/components/persons/PersonsManager.tsx', code);
  console.log('Fixed PersonsManager import');
}
