import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'const handleEditProduct = async \(p: Product \| any\) => \{.*?\setIsProductModalOpen\(true\);\n  \};', 
                 'const handleEditProduct = (p: Product | any) => {\n    setEditingProductId(p.id);\n    setIsProductModalOpen(true);\n  };', 
                 content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)

