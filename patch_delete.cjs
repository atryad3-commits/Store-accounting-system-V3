const fs = require('fs');
let code = fs.readFileSync('src/services/dataService.ts', 'utf-8');

const regex = /\/\/ delete related accounting docs\n\s*const accDocs = await getLocalData<any\[\]>\('accounting_documents', \[\]\);/;

const replacement = `// Remove product price histories for the deleted invoices
    const oldHistories = await getLocalData<any[]>('product_price_history', []);
    const affectedProductsForDelete = new Set<string>();
    const filteredHistories = oldHistories.filter(h => {
        if (toDeleteIds.has(h.invoiceId) || toDeleteIds.has(String(h.invoiceId))) {
            affectedProductsForDelete.add(String(h.productId));
            return false;
        }
        return true;
    });
    
    if (affectedProductsForDelete.size > 0) {
        await saveLocalData('product_price_history', filteredHistories);
        for (const pId of Array.from(affectedProductsForDelete)) {
            await syncProductLatestPrices(pId);
        }
    }

    // delete related accounting docs
    const accDocs = await getLocalData<any[]>('accounting_documents', []);`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/services/dataService.ts', code, 'utf-8');
console.log('Patched deleteInvoice');
