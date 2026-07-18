import re

files = [
    'src/components/financial/ReceiveReceiptModal.tsx',
    'src/components/financial/PayReceiptModal.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Add pb-24 md:pb-6 to the outermost div
    content = content.replace('<div className="w-full font-sans" dir="rtl">', '<div className="w-full font-sans pb-24 md:pb-6" dir="rtl">')
    
    # Adjust header padding
    content = content.replace('px-6 py-4', 'px-4 md:px-6 py-4')
    
    # Adjust main content padding
    content = content.replace('p-6 overflow-y-auto max-h-[75vh]', 'p-4 md:p-6')
    content = content.replace('p-6 overflow-y-auto', 'p-4 md:p-6')
    
    # And footer padding
    content = content.replace('px-6 py-4 border-t', 'px-4 md:px-6 py-4 border-t')
    
    with open(file, 'w') as f:
        f.write(content)
