import sys
with open('src/hooks/useAppController.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "return {" in line and i < len(lines) - 1 and "productSearchTerm" in lines[i+1]:
        lines.insert(i+1, "    activeStoreId, setActiveStoreId,\n    availableStores, setAvailableStores,\n    isStoreSelectionOpen, setIsStoreSelectionOpen,\n")
        break

with open('src/hooks/useAppController.tsx', 'w') as f:
    f.writelines(lines)
