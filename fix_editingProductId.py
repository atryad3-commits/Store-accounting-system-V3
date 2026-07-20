with open('src/hooks/useAppController.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "return {",
    "return { editingProductId, setEditingProductId,"
)

with open('src/hooks/useAppController.tsx', 'w') as f:
    f.write(content)
