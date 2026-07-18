import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Modify mobileAllowedTabs
old_allowed = 'const mobileAllowedTabs = ["persons", "create_receive_receipt", "create_pay_receipt", "person_ledger", "person_profile"];'
new_allowed = 'const mobileAllowedTabs = ["persons", "create_receive_receipt", "create_pay_receipt", "list_receive_receipt", "list_pay_receipt", "person_ledger", "person_profile"];'
content = content.replace(old_allowed, new_allowed)

# Remove setIsReceiveModalOpen and setIsPayModalOpen from MobileRestrictedMenu
old_menu = '<MobileRestrictedMenu activeTab={activeTab} setActiveTab={setActiveTab} setIsReceiveModalOpen={setIsReceiveModalOpen} setIsPayModalOpen={setIsPayModalOpen} />'
new_menu = '<MobileRestrictedMenu activeTab={activeTab} setActiveTab={setActiveTab} />'
content = content.replace(old_menu, new_menu)

with open('src/App.tsx', 'w') as f:
    f.write(content)
