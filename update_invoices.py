import os
import re

components = [
    "src/components/invoices/SaleInvoiceCreate.tsx",
    "src/components/invoices/PurchaseInvoiceCreate.tsx",
    "src/components/invoices/SaleReturnInvoiceCreate.tsx",
    "src/components/invoices/PurchaseReturnInvoiceCreate.tsx"
]

for filepath in components:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the second instance of SearchableSelect (which is for product search)
    parts = content.split('<SearchableSelect')
    if len(parts) >= 3:
        # The first one is customer/person search (parts[1]), the second one is product search (parts[2])
        parts[2] = '\n                        menuPlacement="top"' + parts[2]
        
        new_content = '<SearchableSelect'.join(parts)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"Could not find two SearchableSelects in {filepath}")
