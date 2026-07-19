import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Import SystemUpdatePage
if 'import { SystemUpdatePage }' not in content:
    content = content.replace('import { DatabaseDashboard } from "./components/admin/DatabaseDashboard";', 'import { DatabaseDashboard } from "./components/admin/DatabaseDashboard";\nimport { SystemUpdatePage } from "./components/admin/SystemUpdatePage";')

# Replace JSX
match = re.search(r'(\) : activeTab === "update" \? \()(.*?)(\) : activeTab === "quick_price_inquiry" \? \()', content, flags=re.DOTALL)
if match:
    replacement = r'\1\n                  <SystemUpdatePage storeSettings={storeSettings} setActiveTab={setActiveTab} />\n                \3'
    content = content[:match.start()] + match.expand(replacement) + content[match.end():]

with open('src/App.tsx', 'w') as f:
    f.write(content)

