import re

files = [
    'src/components/financial/ReceiveReceiptModal.tsx',
    'src/components/financial/PayReceiptModal.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Find the redundant title div
    # className={`bg-white rounded-2xl p-6 shadow-sm border ${themeBorder} ${themeLightBg}`}
    content = re.sub(
        r'<div\s+className=\{`bg-white rounded-2xl p-6 shadow-sm border \$\{themeBorder\} \$\{themeLightBg\}`\}\s*>',
        '<div className={`bg-white rounded-2xl p-4 md:p-6 shadow-sm border ${themeBorder} ${themeLightBg}`}>',
        content,
        flags=re.MULTILINE
    )
    
    # Let's also remove the duplicate H2
    content = re.sub(
        r'<h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-4">\s*<Wallet className=\{`w-6 h-6 \$\{themeText\}`\} />\s*\{isReceive\s*\?\s*"ثبت سند رسید دریافت رسمی"\s*:\s*"ثبت سند رسید پرداخت رسمی"\}\s*</h2>',
        '',
        content,
        flags=re.MULTILINE
    )
    
    # same for PayReceiptModal (it might not have isReceive check, maybe just literal text)
    content = re.sub(
        r'<h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-4">\s*<Wallet className=\{`w-6 h-6 \$\{themeText\}`\} />\s*\{!isReceive\s*\?\s*"ثبت سند رسید پرداخت رسمی"\s*:\s*"ثبت سند رسید پرداخت رسمی"\}\s*</h2>',
        '',
        content,
        flags=re.MULTILINE
    )
    # let's be more generic about h2
    content = re.sub(
        r'<h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-4">.*?</h2>',
        '',
        content,
        flags=re.MULTILINE | re.DOTALL
    )

    # Let's fix the flex buttons for cash/check
    # <div className="flex gap-2 max-w-[400px] mb-6 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
    # we want it to be responsive
    content = re.sub(
        r'<div className="flex gap-2 max-w-\[400px\] mb-6 bg-slate-100 p-1\.5 rounded-xl border border-slate-200">',
        '<div className="flex flex-col sm:flex-row gap-2 max-w-[400px] mb-6 bg-slate-100 p-1.5 rounded-xl border border-slate-200">',
        content
    )

    with open(file, 'w') as f:
        f.write(content)
