const fs = require('fs');
let hook = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');
// Undo the bad replace
hook = hook.replace(/  return {\s*isFastStocktaking,/g, '  return {');

// Re-add it only at the very end.
hook = hook.replace('  return {\n    activeFinancialYear,', '  return {\n    isFastStocktaking,\n    activeFinancialYear,');
fs.writeFileSync('src/hooks/useAppController.tsx', hook);
