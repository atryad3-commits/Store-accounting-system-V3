with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.strip().startswith('const ') and ' = ' in line and ('=>' in line or 'function' in line):
        print(f"{i+1}: {line.strip()[:100]}")
    if line.strip().startswith('function ') or line.strip().startswith('export function '):
        print(f"{i+1}: {line.strip()[:100]}")

