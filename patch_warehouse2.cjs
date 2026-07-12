const fs = require('fs');
const content = fs.readFileSync('src/components/warehouses/WarehouseDocCreate.tsx', 'utf8');

const target = `                            let processedAmounts = {};
                            if (deletePreviousDocs) {
                              // We defer deletion until the user clicks Save.
                              // So processedAmounts remains empty, meaning all items are fully available!
                            } else {
                              const pastDocs = (invoices || []).filter(
                                (i) =>
                                  i.sourceInvoiceId?.toString() ===
                                    sourceInvoiceId?.toString() &&
                                  (isReceipt
                                    ? i.type === "warehouse_receipt"
                                    : i.type === "warehouse_remittance"),
                              );
                              pastDocs.forEach((doc) => {
                                if (doc.items) {
                                  doc.items.forEach((rt) => {
                                    const key = String(
                                      rt.productId || rt.productName || "",
                                    );
                                    if (!key) return;
                                    if (!processedAmounts[key])
                                      processedAmounts[key] = 0;
                                    processedAmounts[key] +=
                                      Number(rt.quantity) || 0;
                                  });
                                }
                              });
                            }`;

const replacement = `                            let processedAmounts: Record<string, number> = {};
                            const pastDocs = (invoices || []).filter(
                              (i) =>
                                i.sourceInvoiceId?.toString() ===
                                  sourceInvoiceId?.toString() &&
                                (isReceipt
                                  ? i.type === "warehouse_receipt"
                                  : i.type === "warehouse_remittance") && i.status !== "voided",
                            );
                            pastDocs.forEach((doc) => {
                              if (doc.items) {
                                doc.items.forEach((rt: any) => {
                                  const key = String(
                                    rt.productId || rt.productName || "",
                                  );
                                  if (!key) return;
                                  if (!processedAmounts[key])
                                    processedAmounts[key] = 0;
                                  processedAmounts[key] +=
                                    Number(rt.quantity) || 0;
                                });
                              }
                            });`;

if (content.includes(target)) {
  fs.writeFileSync('src/components/warehouses/WarehouseDocCreate.tsx', content.replace(target, replacement));
  console.log('Patched successfully');
} else {
  console.log('Target not found');
}
