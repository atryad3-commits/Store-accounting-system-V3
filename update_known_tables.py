import re

with open('server.ts', 'r') as f:
    content = f.read()

content = re.sub(
    r"(const KNOWN_TABLES = \[)(.*?)\];",
    lambda m: m.group(1) + m.group(2) + (", 'personal_notes'" if "'personal_notes'" not in m.group(2) else "") + "];",
    content,
    flags=re.DOTALL
)

with open('server.ts', 'w') as f:
    f.write(content)
