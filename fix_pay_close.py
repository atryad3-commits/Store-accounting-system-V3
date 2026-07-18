import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# find PayReceiptModal
# and replace its onClose
pattern = r'(<PayReceiptModal.*?onClose=\{\(\) => setRawActiveTab\(")list_receive_receipt("\)\})'
def replacer(match):
    return match.group(1).replace("list_receive_receipt", "list_pay_receipt")

content = re.sub(pattern, replacer, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
