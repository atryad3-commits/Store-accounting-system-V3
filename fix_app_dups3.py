with open('src/App.tsx', 'r') as f:
    content = f.read()

for comp in ['ProductFormModal', 'PersonFormModal', 'AccountFormModal', 'CashboxFormModal', 'WarehouseFormModal']:
    content = content.replace(f'<{comp} storeSettings={{storeSettings}} storeSettings={{storeSettings}}', f'<{comp} storeSettings={{storeSettings}}')

with open('src/App.tsx', 'w') as f:
    f.write(content)
