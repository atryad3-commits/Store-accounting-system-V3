import re

file = 'src/App.tsx'
with open(file, 'r') as f:
    content = f.read()

# Replace the hidden md:block around SidebarNavigation
pattern1 = r'<div className="hidden md:block">\s*<SidebarNavigation\s*mode="sidebar"'
replacement1 = r'<div className="block">\n            <SidebarNavigation\n              mode="sidebar"'
content = re.sub(pattern1, replacement1, content)

pattern2 = r'<div className="hidden md:block">\s*<SidebarNavigation\s*mode="horizontal"'
replacement2 = r'<div className="block">\n              <SidebarNavigation\n                mode="horizontal"'
content = re.sub(pattern2, replacement2, content)

with open(file, 'w') as f:
    f.write(content)
