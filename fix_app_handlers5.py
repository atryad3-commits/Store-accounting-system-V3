import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'const handleEditAccount = \(acc: Account\) => \{.*?\n  \};', 
                 'const handleEditAccount = (acc: Account) => {\n    setEditingAccountId(acc.id);\n    setIsAccountModalOpen(true);\n  };', 
                 content, flags=re.DOTALL)

content = re.sub(r'const handleEditCashbox = \(box: Cashbox\) => \{.*?\n  \};', 
                 'const handleEditCashbox = (box: Cashbox) => {\n    setEditingCashboxId(box.id);\n    setIsCashboxModalOpen(true);\n  };', 
                 content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
