import re

with open('src/utils/sidebarData.tsx', 'r') as f:
    content = f.read()

content = content.replace('.includes(g.id);', ' || g.id === "personal_workspace").includes(g.id);')

with open('src/utils/sidebarData.tsx', 'w') as f:
    f.write(content)
