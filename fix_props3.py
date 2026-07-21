with open('src/components/products/ProductsTab.tsx', 'r') as f:
    content = f.read()

content = content.replace("setNewProductMinStock,", "")
content = content.replace("setNewProductMinStock", "")

with open('src/components/products/ProductsTab.tsx', 'w') as f:
    f.write(content)
