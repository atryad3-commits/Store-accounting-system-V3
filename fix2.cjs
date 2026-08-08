const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');
content = content.replace(/            \}\)\n        <\/motion\.div>/g, '            })\n          )}\n        </motion.div>');
fs.writeFileSync('src/components/loans/LoansManager.tsx', content);
