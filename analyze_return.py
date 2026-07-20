import re

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

in_return = False
brace_level = 0
for i, line in enumerate(lines):
    if not in_return and 'return (' in line and i > 5000:
        in_return = True
        print(f"Return starts at line {i+1}")
    if in_return:
        brace_level += line.count('{') - line.count('}')
        if "activeTab ===" in line or "activeTab == " in line:
            print(f"{i+1}: {line.strip()[:100]}")
