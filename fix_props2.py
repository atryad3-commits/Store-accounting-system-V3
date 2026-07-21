import re

with open('src/components/products/ProductsTab.tsx', 'r') as f:
    content = f.read()

props_to_remove = [
    "setNewProductSecondaryUnit",
    "setNewProductUnit",
    "setNewProductUnitRatio",
    "setNewProductDesc",
    "setNewProductName",
    "setNewProductPrice",
    "setNewProductType",
    "setNewProductCategoryId",
    "setNewProductCode",
    "setNewProductBarcode",
    "setNewProductPurchasePrice",
    "setNewProductStock",
    "setNewProductMinStock"
]

for p in props_to_remove:
    content = re.sub(r'\s*' + p + r',', '', content)

with open('src/components/products/ProductsTab.tsx', 'w') as f:
    f.write(content)
