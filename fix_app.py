import sys
with open('src/App.tsx', 'r') as f:
    content = f.read()
content = content.replace("import StoreSelectionModal from './components/modals/StoreSelectionModal';", "import BusinessManager from './components/admin/BusinessManager';")
content = content.replace("<StoreSelectionModal", "<BusinessManager")
with open('src/App.tsx', 'w') as f:
    f.write(content)
