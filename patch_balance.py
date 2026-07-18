import re

with open('src/components/persons/PersonLedger.tsx', 'r') as f:
    content = f.read()

content = content.replace('const isBalancePos = entry.balance > 0;', 'const isBalancePos = entry.runningBalance > 0;')
content = content.replace('const isBalanceNeg = entry.balance < 0;', 'const isBalanceNeg = entry.runningBalance < 0;')
content = content.replace('Math.abs(entry.balance)', 'Math.abs(entry.runningBalance)')

with open('src/components/persons/PersonLedger.tsx', 'w') as f:
    f.write(content)
