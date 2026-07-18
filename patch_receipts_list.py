import re

with open('src/components/financial/ReceiptsList.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'setIsReceiveModalOpen\?: \(v: boolean\) => void;\n', '', content)
content = re.sub(r'setIsPayModalOpen\?: \(v: boolean\) => void;\n', '', content)

content = re.sub(r'\s*setIsReceiveModalOpen,', '', content)
content = re.sub(r'\s*setIsPayModalOpen,', '', content)

# Check if it calls it
content = content.replace('setIsReceiveModalOpen?.(true);', "setActiveTab?.('create_receive_receipt');")
content = content.replace('setIsPayModalOpen?.(true);', "setActiveTab?.('create_pay_receipt');")

with open('src/components/financial/ReceiptsList.tsx', 'w') as f:
    f.write(content)
