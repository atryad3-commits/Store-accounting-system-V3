import sys
with open('src/components/modals/WarehouseFormModal.tsx', 'r') as f:
    lines = f.readlines()

# find the trailing `)}` and remove it
for i in range(len(lines)-1, -1, -1):
    if ')}' in lines[i]:
        lines[i] = lines[i].replace(')}', '')
        break

with open('src/components/modals/WarehouseFormModal.tsx', 'w') as f:
    f.writelines(lines)
