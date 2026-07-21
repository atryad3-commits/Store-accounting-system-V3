import sys

with open('src/hooks/useAppController.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "selectedProductCategory," in line and "setSelectedProductCategory," in lines[i+1]:
        lines.insert(i+2, "    productCurrentPage,\n    setProductCurrentPage,\n    productPageSize,\n    setProductPageSize,\n    historyProductId,\n    setHistoryProductId,\n    handleEditProduct,\n    calculateProductCurrentStock,\n")
        break

with open('src/hooks/useAppController.tsx', 'w') as f:
    f.writelines(lines)
