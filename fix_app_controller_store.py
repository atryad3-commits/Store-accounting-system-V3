import sys

with open('src/hooks/useAppController.tsx', 'r') as f:
    lines = f.readlines()

new_state = """
const [activeStoreId, setActiveStoreId] = useState<string | null>(localStorage.getItem("activeStoreId"));
const [availableStores, setAvailableStores] = useState<any[]>([]);
const [isStoreSelectionOpen, setIsStoreSelectionOpen] = useState(!localStorage.getItem("activeStoreId"));

useEffect(() => {
  fetch('/api/databases').then(r => r.json()).then(d => {
    if (d.success) setAvailableStores(d.databases);
  }).catch(() => {});
}, []);
"""

for i, line in enumerate(lines):
    if "const [activeTab, setActiveTab]" in line:
        lines.insert(i, new_state)
        break

returns = """
    activeStoreId, setActiveStoreId,
    availableStores, setAvailableStores,
    isStoreSelectionOpen, setIsStoreSelectionOpen,
"""

for i, line in enumerate(lines):
    if "return {" in line and "isFastStocktaking" in lines[i+1]:
        lines.insert(i+1, returns)
        break

with open('src/hooks/useAppController.tsx', 'w') as f:
    f.writelines(lines)
