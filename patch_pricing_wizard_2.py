import re

with open('src/components/modals/PricingWizardModal.tsx', 'r') as f:
    content = f.read()

btn_div = """              <div className="flex items-center gap-3">"""
new_btn_div = """              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-600">فرمت لیبل:</span>
                  <select
                    value={printFormatId}
                    onChange={(e) => setPrintFormatId(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    {PRINT_FORMATS.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>"""

content = content.replace(btn_div, new_btn_div)

with open('src/components/modals/PricingWizardModal.tsx', 'w') as f:
    f.write(content)
