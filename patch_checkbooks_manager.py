import re

with open('src/components/financial/CheckbooksManager.tsx', 'r') as f:
    content = f.read()

# Add imports
if 'from "../../services/accountingService"' not in content:
    content = content.replace("import persian_fa from 'react-date-object/locales/persian_fa';", "import persian_fa from 'react-date-object/locales/persian_fa';\nimport { addCheckbook, updateCheckbook, deleteCheckbook } from '../../services/accountingService';\nimport { convertToGregorian, formatDateDisplay } from '../../utils/format';")

# Replace safeParseDate usage with direct usage (if we just use it as value in date picker, we can omit it or use convertToGregorian or just the string value)
# safeParseDate(cbIssued)
content = content.replace("safeParseDate(cbIssued)", "cbIssued")

# Destructure fix
content = re.sub(r'const {\s*checkbooks,[^}]*} = props;', 'const { checkbooks, setCheckbooks, accounts, setIssuedCheckbookFilter, setActiveSubTab, storeSettings, showNotification } = props;\n  const notify = showNotification || ((msg: any) => console.log(msg));', content)

with open('src/components/financial/CheckbooksManager.tsx', 'w') as f:
    f.write(content)
