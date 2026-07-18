import re

files = [
    'src/components/financial/ReceiveReceiptModal.tsx',
    'src/components/financial/PayReceiptModal.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Find the duplicated note section
    # <div className="md:col-span-2 lg:col-span-3">
    #   <label className="block text-sm font-bold text-slate-700 mb-1">
    #     یادداشت متنی کوتاه / کد پیگیری
    #   </label>
    #   <input
    #     type="text"
    #     value={receiptNote}
    #     onChange={(e) => setReceiptNote(e.target.value)}
    #     ...
    #   />
    # </div>
    
    # We will just remove it entirely.
    pattern = r'<div className="md:col-span-2 lg:col-span-3">\s*<label className="block text-sm font-bold text-slate-700 mb-1">\s*یادداشت متنی کوتاه / کد پیگیری\s*</label>\s*<input\s*type="text"\s*value=\{receiptNote\}\s*onChange=\{\(e\) => setReceiptNote\(e\.target\.value\)\}.*?/>\s*</div>'
    
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    with open(file, 'w') as f:
        f.write(content)

