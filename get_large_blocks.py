import re

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

def count_lines(start, end):
    return end - start

stack = []
blocks = []

for i, line in enumerate(lines):
    if line.strip().startswith('const ') and ' = ' in line and ('=>' in line or 'async' in line):
        stack.append({'type': 'func', 'name': line.strip().split(' ')[1], 'start': i})
    elif line.strip().startswith('function ') and not line.strip().startswith('function App'):
        stack.append({'type': 'func', 'name': line.strip().split(' ')[1].split('(')[0], 'start': i})
    
    # We won't parse braces properly here unless we do a full brace matching
    
brace_level = 0
current_func = None
funcs = []

for i, line in enumerate(lines):
    brace_level += line.count('{') - line.count('}')
    
    if current_func is None:
        if line.strip().startswith('const ') and ' = ' in line and ('=>' in line or 'async' in line):
            if brace_level > 0:
                current_func = {'name': line.strip().split(' ')[1], 'start': i, 'base_level': brace_level - line.count('{')}
    else:
        if brace_level == current_func['base_level']:
            current_func['end'] = i
            funcs.append(current_func)
            current_func = None

funcs.sort(key=lambda x: x['end'] - x['start'], reverse=True)
for f in funcs[:20]:
    print(f"{f['name']}: {f['end'] - f['start']} lines (from {f['start']} to {f['end']})")

