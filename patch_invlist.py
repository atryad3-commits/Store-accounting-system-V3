import sys

with open('src/components/invoices/InvoicesList.tsx', 'r') as f:
    content = f.read()

target = """                                      .map((it: any) => {
                                        const prod = products.find(
                                          (p) => p.id === it.productId,
                                        );
                                        return {
                                          productId: it.productId,
                                          productName: it.productName,
                                          purchasePrice:
                                            Number(it.unitPrice) || 0,
                                          marginPercent: 0,
                                          salePrice: prod
                                            ? Number(prod.price)
                                            : 0,
                                        };
                                      });"""

replacement = """                                      .map((it: any) => {
                                        const prod = products.find(
                                          (p) => p.id === it.productId,
                                        );
                                        let basePurchasePrice = Number(it.unitPrice) || 0;
                                        if (it.isSecondaryUnit && prod?.unitRatio && prod.unitRatio > 0) {
                                          basePurchasePrice = Number((basePurchasePrice / prod.unitRatio).toFixed(4));
                                        }
                                        return {
                                          productId: it.productId,
                                          productName: it.productName,
                                          purchasePrice: basePurchasePrice,
                                          marginPercent: 0,
                                          salePrice: prod
                                            ? Number(prod.price)
                                            : 0,
                                        };
                                      });"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/components/invoices/InvoicesList.tsx', 'w') as f:
        f.write(content)
    print("InvoicesList.tsx patched successfully!")
else:
    print("Target not found in InvoicesList.tsx")
