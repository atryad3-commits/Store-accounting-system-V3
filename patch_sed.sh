sed -i '71,84c\
                let qty = Number(item.quantity) || 0;\
                let uPrice = item.unitPrice;\
                if (item.isSecondaryUnit && product.unitRatio && product.unitRatio > 0) {\
                   qty = qty * product.unitRatio;\
                   uPrice = Number((Number(uPrice) / product.unitRatio).toFixed(4));\
                }\
                prodHistory.push({\
                   type: inv.type,\
                   date: inv.jalaliDate || new Date(inv.date || inv.createdAt).toLocaleDateString("fa-IR"),\
                   invoiceNumber: inv.invoiceNumber,\
                   quantity: qty,\
                   isSecondaryUnit: false,\
                   unitPrice: uPrice,\
                   personName: persons?.find((p: any) => p.id?.toString() === (inv.customerId || inv.personId)?.toString())?.name || inv.customerName || inv.personName || "---",\
                   warehouseId: item.warehouseId || inv.warehouseId\
                });' src/components/modals/ProductCardModal.tsx
