import re
import os

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

# Find the start of the return statement for App (around 6150 or whatever)
app_start = 0
for i, line in enumerate(lines):
    if line.startswith('export default function App() {'):
        app_start = i
        break

# Find the first `return (` that represents the main return
main_return = 0
brace_level = 0
for i in range(app_start, len(lines)):
    line = lines[i]
    brace_level += line.count('{') - line.count('}')
    
    if line.strip().startswith('if (loading || authLoading) {'):
        main_return = i
        break

# Extract the body of App
app_body_lines = lines[app_start + 1:main_return]

# Find all variables defined in app_body_lines
defined_vars = set()
for line in app_body_lines:
    # const [a, b] = useState
    match1 = re.match(r'^\s*const\s+\[([a-zA-Z0-9_]+),\s*([a-zA-Z0-9_]+)\]', line)
    if match1:
        defined_vars.add(match1.group(1))
        defined_vars.add(match1.group(2))
    
    # const a = ...
    match2 = re.match(r'^\s*const\s+([a-zA-Z0-9_]+)\s*=', line)
    if match2:
        defined_vars.add(match2.group(1))
        
    # let a = ...
    match3 = re.match(r'^\s*let\s+([a-zA-Z0-9_]+)\s*=', line)
    if match3:
        defined_vars.add(match3.group(1))

# Also need imports from App.tsx to put in AppUI.tsx
imports = []
for line in lines[:app_start]:
    if line.startswith('import '):
        imports.append(line)

print(f"Found {len(defined_vars)} defined variables.")
with open('defined_vars.txt', 'w') as f:
    f.write('\n'.join(sorted(list(defined_vars))))
