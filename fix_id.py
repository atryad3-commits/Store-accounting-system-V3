import re

with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace("const id = encodeURIComponent(name.replace(/\\s+/g, '_')) + '_' + Date.now();", "const id = `store_${Math.random().toString(36).substring(2, 8)}_${Date.now().toString().slice(-4)}`;")

with open('server.ts', 'w') as f:
    f.write(content)
