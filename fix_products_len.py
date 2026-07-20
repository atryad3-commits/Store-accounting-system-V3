with open('src/components/products/ProductsTab.tsx', 'r') as f:
    content = f.read()

content = content.replace("{products.length", "{(products || []).length")
content = content.replace("products\n                            .filter", "(products || [])\n                            .filter")
content = content.replace("products\n                                .filter", "(products || [])\n                                .filter")

with open('src/components/products/ProductsTab.tsx', 'w') as f:
    f.write(content)
