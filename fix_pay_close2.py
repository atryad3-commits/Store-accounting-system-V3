with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('onClose={() => setRawActiveTab("            receiptHasDraft={receiptHasDraft}', 'onClose={() => setRawActiveTab("list_pay_receipt")}\n            receiptHasDraft={receiptHasDraft}')

with open('src/App.tsx', 'w') as f:
    f.write(content)
