with open('src/App.tsx', 'r') as f:
    content = f.read()

missing_states = """
  const [productCategories, setProductCategories] = useState<any[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatParentId, setNewCatParentId] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<any>(null);
  const [newCatDesc, setNewCatDesc] = useState("");
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [submittingCategory, setSubmittingCategory] = useState(false);
  const [newCashboxBalance, setNewCashboxBalance] = useState("");
  const [newWarehouseName, setNewWarehouseName] = useState("");
  const [newWarehouseManager, setNewWarehouseManager] = useState("");
  const [newWarehouseLocation, setNewWarehouseLocation] = useState("");
  const [newWarehouseIsActive, setNewWarehouseIsActive] = useState(true);

  // Missing handlers
  const handleSubmitPerson = async (e: any) => { e.preventDefault(); };
"""

content = content.replace('const [isProductModalOpen, setIsProductModalOpen] = useState(false);', missing_states + '\n  const [isProductModalOpen, setIsProductModalOpen] = useState(false);')

with open('src/App.tsx', 'w') as f:
    f.write(content)
