with open('src/hooks/useAppController.tsx', 'r') as f:
    content = f.read()

content = content.replace("editingProductId, setEditingProductId,    isFastStocktaking,", "isFastStocktaking,")

with open('src/hooks/useAppController.tsx', 'w') as f:
    f.write(content)
