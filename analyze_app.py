import re

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.startswith('const ') and ('= () =>' in line or '= ({' in line or '= (props' in line or '= function' in line or '= ( ' in line):
        print(f"{i+1}: {line.strip()}")
    elif line.startswith('function ') or line.startswith('export function ') or line.startswith('export default function '):
        print(f"{i+1}: {line.strip()}")
    elif line.startswith('const ') and ' = ' in line and ('Component' in line or line[6].isupper()):
        print(f"{i+1}: {line.strip()[:100]}")
