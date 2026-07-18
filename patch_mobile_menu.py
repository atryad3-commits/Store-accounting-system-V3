import re

with open('src/components/MobileRestrictedMenu.tsx', 'r') as f:
    content = f.read()

# Add List to lucide-react imports if it's not there
if 'List' not in content:
    content = content.replace("Wallet }", "Wallet, List }")

tabs_str = """    {
      id: 'persons',
      label: 'ثبت شخص',
      icon: UserPlus,
      action: () => setActiveTab('persons')
    },"""

new_tabs_str = """    {
      id: 'persons',
      label: 'ثبت شخص',
      icon: UserPlus,
      action: () => setActiveTab('persons')
    },
    {
      id: 'list_receipts',
      label: 'رسیدها',
      icon: List,
      action: () => setActiveTab('list_receive_receipt')
    },"""

content = content.replace(tabs_str, new_tabs_str)

# Also update isActive to match the new tab
is_active_str = """          const isActive = activeTab === tab.id || 
                           (tab.id === 'receive' && activeTab === 'create_receive_receipt') ||
                           (tab.id === 'pay' && activeTab === 'create_pay_receipt');"""

new_is_active_str = """          const isActive = activeTab === tab.id || 
                           (tab.id === 'receive' && activeTab === 'create_receive_receipt') ||
                           (tab.id === 'pay' && activeTab === 'create_pay_receipt') ||
                           (tab.id === 'list_receipts' && (activeTab === 'list_receive_receipt' || activeTab === 'list_pay_receipt'));"""

content = content.replace(is_active_str, new_is_active_str)

with open('src/components/MobileRestrictedMenu.tsx', 'w') as f:
    f.write(content)
