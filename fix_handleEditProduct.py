import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Just find the function and replace it up to its end.
# Since it's followed by `const handleDuplicateProduct`, we can use that as boundary.
match = re.search(r'const handleEditProduct = async \(p: Product \| any\) => \{.*?setProductFormTab\("general"\);\s*setIsProductModalOpen\(true\);\s*};', content, flags=re.DOTALL)
if match:
    content = content[:match.start()] + 'const handleEditProduct = (p: Product | any) => {\n    setEditingProductId(p.id);\n    setIsProductModalOpen(true);\n  };' + content[match.end():]

with open('src/App.tsx', 'w') as f:
    f.write(content)

