import re

# look at ProductsTab keys
with open('src/components/products/ProductsTab.tsx', 'r') as f:
    print([line for line in f if "key=" in line])

