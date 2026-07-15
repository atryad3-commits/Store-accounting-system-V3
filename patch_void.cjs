const fs = require('fs');
let code = fs.readFileSync('src/services/dataService.ts', 'utf-8');

const regex = /\/\/ void related accounting docs\n\s*const accDocs = await getLocalData<any\[\]>\('accounting_documents', \[\]\);/;

const replacement = `// Remove product price histories for the voided invoices
    const oldHistories = await getLocalData<any[]>('product_price_history', []);
    const affectedProductsForVoid = new Set<string>();
    const filteredHistories = oldHistories.filter(h => {
        if (toVoidIds.has(h.invoiceId) || toVoidIds.has(String(h.invoiceId))) {
            affectedProductsForVoid.add(String(h.productId));
            return false;
        }
        return true;
    });
    
    if (affectedProductsForVoid.size > 0) {
        await saveLocalData('product_price_history', filteredHistories);
        for (const pId of Array.from(affectedProductsForVoid)) {
            await syncProductLatestPrices(pId);
        }
    }

    // void related accounting docs
    const accDocs = await getLocalData<any[]>('accounting_documents', []);`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/services/dataService.ts', code, 'utf-8');
console.log('Patched voidInvoice');
