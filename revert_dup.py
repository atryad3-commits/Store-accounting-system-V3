with open('src/hooks/useAppController.tsx', 'r') as f:
    content = f.read()

content = content.replace("return { editingProductId, setEditingProductId,", "return {")
content = content.replace("{ editingProductId, setEditingProductId, amount", "{ amount")

with open('src/hooks/useAppController.tsx', 'w') as f:
    f.write(content)
