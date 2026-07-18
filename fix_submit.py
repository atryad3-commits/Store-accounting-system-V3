import re

files = [
    'src/components/financial/ReceiveReceiptModal.tsx',
    'src/components/financial/PayReceiptModal.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
    #   <button
    #     type="submit"
    #     disabled={submittingReceipt}
    #     className={`px-8 py-3 ${themeBg} text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border-none cursor-pointer shadow-sm w-full md:w-auto`}
    
    content = content.replace(
        '<div className="flex justify-end gap-3 pt-4 border-t border-slate-200">',
        '<div className="flex flex-col md:flex-row justify-end gap-3 pt-4 border-t border-slate-200">'
    )
    
    # We want to add w-full md:w-auto justify-center to the submit button
    content = re.sub(
        r'className=\{`px-8 py-3 \$\{themeBg\} text-white rounded-xl font-bold flex items-center gap-2 transition-colors border-none cursor-pointer shadow-sm`\}',
        r'className={`px-8 py-3 ${themeBg} text-white rounded-xl font-bold flex items-center justify-center w-full md:w-auto gap-2 transition-colors border-none cursor-pointer shadow-sm`}',
        content
    )

    with open(file, 'w') as f:
        f.write(content)

