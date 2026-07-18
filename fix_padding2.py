import re

files = [
    'src/components/financial/ReceiveReceiptModal.tsx',
    'src/components/financial/PayReceiptModal.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Find the main body container
    content = content.replace('<div className="p-6 space-y-6">', '<div className="p-4 md:p-6 space-y-6">')
    
    with open(file, 'w') as f:
        f.write(content)
