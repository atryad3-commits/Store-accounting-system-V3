import sys

with open('src/hooks/useAppController.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "return {" in line and "isFastStocktaking" in lines[i+1]:
        lines.insert(i+1, "    productSearchTerm,\n    setProductSearchTerm,\n")
        break

with open('src/hooks/useAppController.tsx', 'w') as f:
    f.writelines(lines)
