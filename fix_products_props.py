import re

with open('src/components/products/ProductsTab.tsx', 'r') as f:
    content = f.read()

# Remove props destructing
content = re.sub(r'\s*setNewProductSecondaryUnit,\s*', '\n', content)
content = re.sub(r'\s*setNewProductUnit,\s*', '\n', content)
content = re.sub(r'\s*setNewProductUnitRatio,\s*', '\n', content)
content = re.sub(r'\s*setNewProductDesc,\s*', '\n', content)
content = re.sub(r'\s*setNewProductName,\s*', '\n', content)
content = re.sub(r'\s*setNewProductPrice,\s*', '\n', content)
content = re.sub(r'\s*setNewProductType,\s*', '\n', content)
content = re.sub(r'\s*setNewProductCategoryId,\s*', '\n', content)
content = re.sub(r'\s*setNewProductCode,\s*', '\n', content)
content = re.sub(r'\s*setNewProductBarcode,\s*', '\n', content)
content = re.sub(r'\s*setNewProductPurchasePrice,\s*', '\n', content)
content = re.sub(r'\s*setNewProductStock,\s*', '\n', content)
content = re.sub(r'\s*setNewProductMinStock,\s*', '\n', content)

# Remove setProductFormTab if not needed elsewhere
# Actually, wait, let's see if setProductFormTab is used elsewhere.
