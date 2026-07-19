import re

with open('src/utils/sidebarData.tsx', 'r') as f:
    content = f.read()

content = content.replace(' || g.id === "personal_workspace").includes(g.id);', '.includes(g.id);')

content = re.sub(r'return (\[.*?\])\.includes\(g\.id\);', r'return \1.includes(g.id) || g.id === "personal_workspace";', content)

with open('src/utils/sidebarData.tsx', 'w') as f:
    f.write(content)
