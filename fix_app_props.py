with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('confirmAction={confirmAction}', 'confirmAction={confirmAction}\n                storeSettings={storeSettings}')

with open('src/App.tsx', 'w') as f:
    f.write(content)
