import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("import useAppController from './hooks/useAppController';", "import useAppController from './hooks/useAppController';\nimport StoreSelectionModal from './components/modals/StoreSelectionModal';")

with open('src/App.tsx', 'w') as f:
    f.write(content)
