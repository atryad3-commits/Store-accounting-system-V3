import sys

with open('src/components/modals/ProductCardModal.tsx', 'r') as f:
    lines = f.readlines()

out_lines = []
skip = False
for line in lines:
    if "prodHistory.push({" in line and "type: inv.type" in lines[lines.index(line) + 1]:
        skip = True
        out_lines.append("""                let qty = Number(item.quantity) || 0;
                let uPrice = item.unitPrice;
                if (item.isSecondaryUnit && product.unitRatio && product.unitRatio > 0) {
                   qty = qty * product.unitRatio;
                   uPrice = Number((Number(uPrice) / product.unitRatio).toFixed(4));
                }
                prodHistory.push({
                   type: inv.type, 
                   date: inv.jalaliDate || new Date(inv.date || inv.createdAt).toLocaleDateString('fa-IR'),
                   invoiceNumber: inv.invoiceNumber,
                   quantity: qty,
                   isSecondaryUnit: false,
                   unitPrice: uPrice,
                   personName: persons?.find((p: any) => p.id?.toString() === (inv.customerId || inv.personId)?.toString())?.name || inv.customerName || inv.personName || '---',
                   warehouseId: item.warehouseId || inv.warehouseId
                });\n""")
        continue
    if skip:
        if "qty = qty * product.unitRatio;" in line:
            skip = False
            # also skip the closing brace for if block
            continue
    
    if skip and "}" in line and "qty = qty" not in line and "let qty = Number" not in line and "if (item.isSecondaryUnit" not in line:
        pass
    
    if not skip:
        # Wait, the closing brace of the if block will be added in the next line if I do it wrong.
        pass

