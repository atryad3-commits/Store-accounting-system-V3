import re

with open('src/components/products/ProductsTab.tsx', 'r') as f:
    content = f.read()

content = re.sub(r',\s*,\s*\.\.\.rest', ',\n    ...rest', content)

with open('src/components/products/ProductsTab.tsx', 'w') as f:
    f.write(content)
