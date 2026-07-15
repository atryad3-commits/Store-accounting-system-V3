const fs = require('fs');
let code = fs.readFileSync('src/services/dataService.ts', 'utf-8');

const regex = /export const updateProductPriceHistory = async \(id: string, updatedData: any\) => \{\n\s*return await updateLocalData\('product_price_history', id, updatedData\);\n\};/;
const replacement = `export const updateProductPriceHistory = async (id: string, updatedData: any) => {
  const result = await updateLocalData('product_price_history', id, updatedData);
  if (updatedData && updatedData.productId) {
      await syncProductLatestPrices(updatedData.productId);
  } else {
      const oldHistories = await getLocalData<any[]>('product_price_history', []);
      const history = oldHistories.find(h => String(h.id) === String(id));
      if (history && history.productId) {
          await syncProductLatestPrices(history.productId);
      }
  }
  return result;
};`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/services/dataService.ts', code, 'utf-8');
console.log('Patched updateProductPriceHistory');
