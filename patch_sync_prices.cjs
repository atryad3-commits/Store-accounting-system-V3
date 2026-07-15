const fs = require('fs');
let code = fs.readFileSync('src/services/dataService.ts', 'utf-8');

const syncFunc = `
export const syncProductLatestPrices = async (productId: string) => {
  const history = await getLocalData<any[]>('product_price_history', []);
  const productHistory = history.filter((h: any) => String(h.productId) === String(productId));

  if (productHistory.length === 0) return;

  // Sort by date descending (latest first)
  productHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const latestPurchase = productHistory.find((h: any) => h.type === 'purchase')?.price || 0;
  const latestSale = productHistory.find((h: any) => h.type === 'sale')?.price || 0;

  const products = await getLocalData<any[]>('products', []);
  const index = products.findIndex((p: any) => String(p.id) === String(productId));
  if (index !== -1) {
    const product = products[index];
    const updatePayload: any = {};
    let shouldUpdate = false;
    
    if (latestPurchase > 0 && product.purchasePrice !== latestPurchase) {
      updatePayload.purchasePrice = latestPurchase;
      shouldUpdate = true;
    }
    if (latestSale > 0 && product.price !== latestSale) {
      updatePayload.price = latestSale;
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      const newProduct = { ...product, ...updatePayload, updatedAt: Date.now() };
      await updateLocalData('products', product.id, newProduct);
    }
  }
};
`;

if (!code.includes('syncProductLatestPrices')) {
  code = code.replace('export const addInvoice', syncFunc + '\nexport const addInvoice');
  
  // Patch addInvoice
  code = code.replace(
    /for \(const item of newInvoice\.items\) {/g,
    `const affectedProducts = new Set<string>();
         for (const item of newInvoice.items) {`
  );
  
  code = code.replace(
    /invoiceItemId: item\.id \|\| generateId\(\)\n\s*}\);\n\s*}\n\s*}/,
    `invoiceItemId: item.id || generateId()
                 });
                 affectedProducts.add(String(item.productId));
             }
         }
         for (const pId of Array.from(affectedProducts)) {
             await syncProductLatestPrices(pId);
         }`
  );

  // Patch updateInvoice
  code = code.replace(
    /if \(newInvoice\.items && Array\.isArray\(newInvoice\.items\)\) {/,
    `const affectedProducts = new Set<string>();
          if (newInvoice.items && Array.isArray(newInvoice.items)) {`
  );

  code = code.replace(
    /invoiceItemId: item\.id \|\| generateId\(\)\n\s*}\);\n\s*}\n\s*}\n\s*}\n\s*await saveLocalData\('product_price_history', filteredHistories\);/,
    `invoiceItemId: item.id || generateId()
                      });
                      affectedProducts.add(String(item.productId));
                  }
              }
          }
          await saveLocalData('product_price_history', filteredHistories);
          for (const pId of Array.from(affectedProducts)) {
              await syncProductLatestPrices(pId);
          }`
  );

  fs.writeFileSync('src/services/dataService.ts', code, 'utf-8');
  console.log('Patched sync prices');
} else {
  console.log('Already patched');
}
