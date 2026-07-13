const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');

const startIndex = 4040; // 4041-1
const endIndex = 4066; // 4067-1

const replacement = `  const getLastPriceForProduct = (
    productId: string | number,
    isPurchase: boolean,
  ) => {
    let lastPrice = 0;
    let latestDate = 0;
    const targetTypes = isPurchase
      ? ["purchase", "warehouse_receipt"]
      : ["sale", "warehouse_remittance"];

    // Use the invoice date if available, otherwise current date
    const currentInvoiceDate = date ? new Date(date).getTime() : new Date().getTime();

    invoices.forEach((inv) => {
      if (targetTypes.includes(inv.type) && inv.items && inv.status !== 'voided' && !inv.isDeleted && inv.status !== 'draft' && !inv.isDraft) {
        inv.items.forEach((item: any) => {
          if (item.productId?.toString() === productId.toString()) {
            const invDate = new Date(inv.date || inv.createdAt || 0).getTime();
            // Ensure the invoice date is before or equal to the current invoice date
            if (invDate <= currentInvoiceDate && invDate > latestDate && (item.unitPrice || 0) > 0) {
              latestDate = invDate;
              // Normalize unit prices assuming the standard is the same unless exchange rate applies
              const rate = inv.exchangeRate || 1;
              lastPrice = (Number(item.unitPrice) || 0) * rate;
            }
          }
        });
      }
    });
    return lastPrice;
  };`;

lines.splice(startIndex, endIndex - startIndex + 1, replacement);
fs.writeFileSync('src/App.tsx', lines.join('\n'));
