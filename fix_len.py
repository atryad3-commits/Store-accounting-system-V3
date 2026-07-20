with open('src/components/products/ProductsTab.tsx', 'r') as f:
    content = f.read()
    
content = content.replace("productCategories.length", "(productCategories || []).length")
content = content.replace("productCategories.slice", "(productCategories || []).slice")
content = content.replace("productCategories.find", "(productCategories || []).find")

with open('src/components/products/ProductsTab.tsx', 'w') as f:
    f.write(content)
