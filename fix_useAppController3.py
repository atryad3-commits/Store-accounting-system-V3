import sys

with open('src/hooks/useAppController.tsx', 'r') as f:
    lines = f.readlines()

# Revert broken insertions
new_lines = []
skip = False
for i, line in enumerate(lines):
    if skip:
        if "useState<string>(\"all\");" in line:
            new_lines.append(line)
            skip = False
        elif "setSelectedProductCategory, setProductCategories] = useState<any[]>([]);" in line:
            new_lines.append("const [productCategories, setProductCategories] = useState<any[]>([]);\n")
            skip = False
        continue
    
    if "const [selectedProductCategory, setSelectedProductCategory] =" in line:
        new_lines.append(line)
        skip = True
    elif "selectedProductCategory," in line and "setSelectedProductCategory, setProductCategories]" in lines[i+1]:
        skip = True
    else:
        new_lines.append(line)

with open('src/hooks/useAppController.tsx', 'w') as f:
    f.writelines(new_lines)
