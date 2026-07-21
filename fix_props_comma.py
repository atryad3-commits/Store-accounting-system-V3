with open('src/components/products/ProductsTab.tsx', 'r') as f:
    content = f.read()

content = content.replace("setEditingProductId,\n    ,\n    ...rest", "setEditingProductId,\n    ...rest")

with open('src/components/products/ProductsTab.tsx', 'w') as f:
    f.write(content)
