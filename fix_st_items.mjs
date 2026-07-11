import fs from 'fs';
let code = fs.readFileSync('src/components/inventory/StocktakingManager.tsx', 'utf8');
code = code.replace(
  /st\.items\.length/g,
  '(st.items || []).length'
);
fs.writeFileSync('src/components/inventory/StocktakingManager.tsx', code);
