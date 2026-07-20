import re

with open('src/components/products/ProductsTab.tsx', 'r') as f:
    content = f.read()

content = content.replace("map((cat) =>", "map((cat, idx) =>")

with open('src/components/products/ProductsTab.tsx', 'w') as f:
    f.write(content)
