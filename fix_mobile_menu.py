import re

file = 'src/components/MobileRestrictedMenu.tsx'
with open(file, 'r') as f:
    content = f.read()

# Update imports
content = content.replace("Wallet, List, Package }", "Wallet, List, Package, Menu }")

# Update interface
content = content.replace("setIsPayModalOpen?: (isOpen: boolean) => void;\n}", "setIsPayModalOpen?: (isOpen: boolean) => void;\n  setIsSidebarOpen?: (isOpen: boolean) => void;\n}")
content = content.replace("setIsPayModalOpen }: MobileRestrictedMenuProps)", "setIsPayModalOpen, setIsSidebarOpen }: MobileRestrictedMenuProps)")

# Update tabs
new_tabs = """  const tabs = [
    {
      id: 'persons',
      label: 'اشخاص',
      icon: UserPlus,
      action: () => setActiveTab('persons')
    },
    {
      id: 'products',
      label: 'کالاها',
      icon: Package,
      action: () => setActiveTab('products')
    },
    {
      id: 'receive',
      label: 'دریافت',
      icon: ArrowDownToLine,
      action: () => {
        if (setIsReceiveModalOpen) setIsReceiveModalOpen(true);
        else setActiveTab('create_receive_receipt');
      }
    },
    {
      id: 'pay',
      label: 'پرداخت',
      icon: ArrowUpFromLine,
      action: () => {
        if (setIsPayModalOpen) setIsPayModalOpen(true);
        else setActiveTab('create_pay_receipt');
      }
    },
    {
      id: 'menu',
      label: 'بیشتر',
      icon: Menu,
      action: () => {
        if (setIsSidebarOpen) setIsSidebarOpen(true);
      }
    }
  ];"""

content = re.sub(r'const tabs = \[.*?\];', new_tabs, content, flags=re.DOTALL)

with open(file, 'w') as f:
    f.write(content)
