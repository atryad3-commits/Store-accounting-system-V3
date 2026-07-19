with open('src/components/modals/PersonFormModal.tsx', 'r') as f:
    content = f.read()

content = content.replace('storeSettings?: any;', 'storeSettings?: any;\n  setActiveTab?: (tab: string) => void;\n  setLedgerPersonId?: (id: string) => void;')
content = content.replace('storeSettings,', 'storeSettings,\n  setActiveTab,\n  setLedgerPersonId,')

with open('src/components/modals/PersonFormModal.tsx', 'w') as f:
    f.write(content)
