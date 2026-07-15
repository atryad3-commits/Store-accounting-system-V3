const fs = require('fs');
let code = fs.readFileSync('src/services/dataService.ts', 'utf-8');

const oldFunc = `export const addStocktaking = async (st: any) => {
  let activeYear = null;
  if (st.date) activeYear = await checkFinancialYear(st.date);
  const stocktakings = await getStocktakings();
  const added = { ...st, id: generateId(), fiscalYearId: activeYear ? activeYear.id : undefined };
  stocktakings.push(added);
  await saveStocktakings(stocktakings);
  return added;
};`;

const newFunc = `export const addStocktaking = async (st: any) => {
  let activeYear = null;
  if (st.date) activeYear = await checkFinancialYear(st.date);
  const stocktakings = await getStocktakings();
  
  let newId;
  let isUnique = false;
  while (!isUnique) {
    newId = Math.floor(10000 + Math.random() * 90000).toString();
    if (!stocktakings.find(s => String(s.id) === newId)) {
      isUnique = true;
    }
  }

  const added = { ...st, id: newId, fiscalYearId: activeYear ? activeYear.id : undefined };
  stocktakings.push(added);
  await saveStocktakings(stocktakings);
  return added;
};`;

code = code.replace(oldFunc, newFunc);
fs.writeFileSync('src/services/dataService.ts', code, 'utf-8');
console.log('Patched addStocktaking');
