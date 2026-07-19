import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('| "update"', '| "update"\n    | "personal_notes"')
content = content.replace(') : activeTab === "update" ? (', ') : activeTab === "personal_notes" ? (\n                  <PersonalNotesManager storeSettings={storeSettings} />\n                ) : activeTab === "update" ? (')

if 'import { PersonalNotesManager }' not in content:
    content = content.replace('import { SystemUpdatePage } from "./components/admin/SystemUpdatePage";', 'import { SystemUpdatePage } from "./components/admin/SystemUpdatePage";\nimport { PersonalNotesManager } from "./components/notes/PersonalNotesManager";')


with open('src/App.tsx', 'w') as f:
    f.write(content)

