import re

files = [
    'src/components/financial/ReceiveReceiptModal.tsx',
    'src/components/financial/PayReceiptModal.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    content = content.replace('<div className="w-full font-sans pb-24 md:pb-6" dir="rtl">', '<div className="w-full font-sans" dir="rtl">')
    
    with open(file, 'w') as f:
        f.write(content)

