import re

files = [
    'src/components/financial/ReceiveReceiptModal.tsx',
    'src/components/financial/PayReceiptModal.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Find the header end
    header_end = """                  <div>
                    <h2 className="text-lg font-black text-slate-800">"""
    
    # We will add a close button if not exists
    if '<button onClick={onClose}' not in content:
        replace_text = """                  <div>
                    <h2 className="text-lg font-black text-slate-800">"""
        # wait, let's just find the `</div>` after the title.
        
        # better:
        content = content.replace("""                  <div>
                    <h2 className="text-lg font-black text-slate-800">ثبت رسید دریافت وجه</h2>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">ثبت دریافتی‌های نقدی و چکی</p>
                  </div>
                </div>
              </div>""", """                  <div>
                    <h2 className="text-lg font-black text-slate-800">ثبت رسید دریافت وجه</h2>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">ثبت دریافتی‌های نقدی و چکی</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>""")

        content = content.replace("""                  <div>
                    <h2 className="text-lg font-black text-slate-800">ثبت رسید پرداخت وجه</h2>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">ثبت پرداختی‌های نقدی و چکی</p>
                  </div>
                </div>
              </div>""", """                  <div>
                    <h2 className="text-lg font-black text-slate-800">ثبت رسید پرداخت وجه</h2>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">ثبت پرداختی‌های نقدی و چکی</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>""")

    with open(file, 'w') as f:
        f.write(content)
