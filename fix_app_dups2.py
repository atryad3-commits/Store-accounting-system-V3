with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('confirmAction={confirmAction}\n                storeSettings={storeSettings}', 'confirmAction={confirmAction}')

with open('src/App.tsx', 'w') as f:
    f.write(content)
