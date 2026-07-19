import sys

with open('src/App.tsx', 'r') as f:
    app_lines = f.readlines()

with open('extra_modals.tsx', 'r') as f:
    extra_lines = f.readlines()

insert_idx = -1
for i, line in enumerate(app_lines):
    if '<WarehouseFormModal' in line:
        # Find the end of this component tag
        for j in range(i, len(app_lines)):
            if '/>' in app_lines[j]:
                insert_idx = j + 1
                break
        break

if insert_idx != -1:
    app_lines = app_lines[:insert_idx] + extra_lines + app_lines[insert_idx:]
    with open('src/App.tsx', 'w') as f:
        f.writelines(app_lines)
    print("Inserted extra modals")
else:
    print("Could not find WarehouseFormModal in App.tsx")

