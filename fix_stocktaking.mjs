import fs from 'fs';
let content = fs.readFileSync('src/components/inventory/StocktakingManager.tsx', 'utf8');
content = content.replace(/\(st\.items\)\.length/g, '(st.items || []).length');
fs.writeFileSync('src/components/inventory/StocktakingManager.tsx', content);
