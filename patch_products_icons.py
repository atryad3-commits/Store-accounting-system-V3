import re

with open('src/components/products/ProductsTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('BarcodeIcon: BarcodeIconLib', '')
content = content.replace('<BarcodeIconLib', '<Barcode')

with open('src/components/products/ProductsTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

