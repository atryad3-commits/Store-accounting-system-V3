import re

file = 'src/components/MobileRestrictedMenu.tsx'
with open(file, 'r') as f:
    content = f.read()

# Add Package to imports
if 'Package' not in content:
    content = content.replace('Wallet, List } from \'lucide-react\';', 'Wallet, List, Package } from \'lucide-react\';')

# Add the new tab
new_tab = """    {
      id: 'person_ledger',
      label: 'کارت حساب',
      icon: Wallet,
      action: () => setActiveTab('person_ledger')
    },
    {
      id: 'products',
      label: 'کالاها',
      icon: Package,
      action: () => setActiveTab('products')
    }"""

content = content.replace("""    {
      id: 'person_ledger',
      label: 'کارت حساب',
      icon: Wallet,
      action: () => setActiveTab('person_ledger')
    }""", new_tab)

with open(file, 'w') as f:
    f.write(content)
