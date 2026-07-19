with open('src/App.tsx', 'r') as f:
    content = f.read()

missing = """
  const [editingHistoryId, setEditingHistoryId] = useState<any>(null);
  const [editingHistoryDate, setEditingHistoryDate] = useState("");
  const [currentProductPriceHistory, setCurrentProductPriceHistory] = useState<any[]>([]);
"""
content = content.replace('const [editingProductId, setEditingProductId] = useState<any>(null);', 'const [editingProductId, setEditingProductId] = useState<any>(null);' + missing)

with open('src/App.tsx', 'w') as f:
    f.write(content)
