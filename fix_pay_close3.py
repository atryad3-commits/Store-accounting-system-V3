with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'onClose={() => setRawActiveTab("' in line and 'receiptHasDraft' not in line:
        # maybe it's on the next line?
        pass

# let's just do a regex replace
import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'onClose=\{\(\) => setRawActiveTab\("\s*receiptHasDraft=\{receiptHasDraft\}', 
                 'onClose={() => setRawActiveTab("list_pay_receipt")}\n            receiptHasDraft={receiptHasDraft}', 
                 content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
