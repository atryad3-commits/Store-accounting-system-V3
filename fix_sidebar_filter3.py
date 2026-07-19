import re

with open('src/utils/sidebarData.tsx', 'r') as f:
    content = f.read()

content = content.replace(' || g.id === "personal_workspace"', '')
content = content.replace('.includes(g.id);', '.includes(g.id) || g.id === "personal_workspace";')

with open('src/utils/sidebarData.tsx', 'w') as f:
    f.write(content)
