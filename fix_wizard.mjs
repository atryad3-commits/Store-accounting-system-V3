import fs from 'fs';
let code = fs.readFileSync('src/components/modals/GroupPriceUpdateWizard.tsx', 'utf8');
code = code.replace(/initialSelectedIds\.length/g, '(initialSelectedIds || []).length');
code = code.replace(/items\.length/g, '(items || []).length');
fs.writeFileSync('src/components/modals/GroupPriceUpdateWizard.tsx', code);
