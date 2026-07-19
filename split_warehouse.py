import sys

with open('src/components/modals/WarehouseFormModal.tsx', 'r') as f:
    lines = f.readlines()

extra_start = -1
for i, line in enumerate(lines):
    if '{/* Invoice Saved Viewer / Print Sheet Modals */}' in line:
        extra_start = i
        break

if extra_start == -1:
    print("Could not find split point")
    sys.exit(1)

extra_lines = lines[extra_start:-2] # skip the last two lines:  ); \n }

with open('src/components/modals/WarehouseFormModal.tsx', 'w') as f:
    f.writelines(lines[:extra_start] + ['  );\n}\n'])

with open('extra_modals.tsx', 'w') as f:
    f.writelines(extra_lines)

print("Split WarehouseFormModal")
