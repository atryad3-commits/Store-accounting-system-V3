with open('src/components/financial/CheckbooksManager.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { addCheckbook, updateCheckbook, deleteCheckbook } from '../../services/accountingService';", "import { addCheckbook, updateCheckbook, deleteCheckbook, getCheckbooks } from '../../services/accountingService';")

content = content.replace("setCheckbooks(await props.getCheckbooks());", "setCheckbooks(await getCheckbooks());")

with open('src/components/financial/CheckbooksManager.tsx', 'w') as f:
    f.write(content)
