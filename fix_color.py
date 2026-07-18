with open('src/components/modals/ProductCardModal.tsx', 'r') as f:
    lines = f.readlines()

purchase_found = False
for i, line in enumerate(lines):
    if "activeTab === 'purchases'" in line:
        purchase_found = True
    if purchase_found and 'className="text-rose-600" dir="ltr"' in line:
        lines[i] = line.replace('className="text-rose-600"', 'className="text-emerald-600"')
        break # Only replace the first one in purchases

with open('src/components/modals/ProductCardModal.tsx', 'w') as f:
    f.writelines(lines)
