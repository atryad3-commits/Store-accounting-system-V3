import re

files = [
    'src/components/financial/ReceiveReceiptModal.tsx',
    'src/components/financial/PayReceiptModal.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Find <div className="md:col-span-2 lg:col-span-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm mt-2">
    content = content.replace(
        '<div className="md:col-span-2 lg:col-span-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm mt-2">',
        '<div className="md:col-span-2 lg:col-span-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm mt-2">'
    )
    
    with open(file, 'w') as f:
        f.write(content)

