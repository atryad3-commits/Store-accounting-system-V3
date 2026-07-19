import sys
import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# I want to find the exact pattern `{ \n <ProductFormModal` and remove the `{`
content = re.sub(r'\{\s*<ProductFormModal', '<ProductFormModal', content)
content = re.sub(r'\{\s*<PersonFormModal', '<PersonFormModal', content)
content = re.sub(r'\{\s*<AccountFormModal', '<AccountFormModal', content)
content = re.sub(r'\{\s*<CashboxFormModal', '<CashboxFormModal', content)
content = re.sub(r'\{\s*<WarehouseFormModal', '<WarehouseFormModal', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
