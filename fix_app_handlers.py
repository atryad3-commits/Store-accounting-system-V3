import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# handleFastEditProduct ?
content = re.sub(r'const handleEditProduct = \(p: Product \| any\) => \{.*?\n  \};', 
                 'const handleEditProduct = (p: Product | any) => {\n    setEditingProductId(p.id);\n    setIsProductModalOpen(true);\n  };', 
                 content, flags=re.DOTALL)

content = re.sub(r'const handleDuplicateProduct = \(p: Product \| any\) => \{.*?\n  \};', 
                 'const handleDuplicateProduct = (p: Product | any) => {\n    setEditingProductId(null);\n    setIsProductModalOpen(true);\n  };', 
                 content, flags=re.DOTALL)

content = re.sub(r'const handleEditAccount = \(acc: any\) => \{.*?\n  \};', 
                 'const handleEditAccount = (acc: any) => {\n    setEditingAccountId(acc.id);\n    setIsAccountModalOpen(true);\n  };', 
                 content, flags=re.DOTALL)

content = re.sub(r'const handleEditCashbox = \(cb: any\) => \{.*?\n  \};', 
                 'const handleEditCashbox = (cb: any) => {\n    setEditingCashboxId(cb.id);\n    setIsCashboxModalOpen(true);\n  };', 
                 content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
