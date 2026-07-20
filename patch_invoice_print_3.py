import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# For previewInvoiceData
preview_header_pattern = r'(<h3[^>]*>.*?برگه پیش‌نویس.*?</h3>\s*<div[^>]*>)'
preview_replacement = r"""\1
                            <select
                              value={invoicePrintFormat}
                              onChange={(e) => setInvoicePrintFormat(e.target.value as any)}
                              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-700 outline-none"
                            >
                              <option value="a4">کاغذ A4</option>
                              <option value="a5">کاغذ A5</option>
                              <option value="pos80">لیبل پرینتر</option>
                            </select>"""
content = re.sub(preview_header_pattern, preview_replacement, content, flags=re.DOTALL)

# Add <style> to previewInvoiceData
preview_style_pattern = r'(<div className="p-6 md:p-8 overflow-y-auto flex-1 text-gray-800 text-sm print:overflow-visible print:px-8 print:py-12 bg-gray-50/50 print:bg-white flex justify-center">)'
preview_style_replacement = r"""\1
                          <style>{`
                            @media print {
                              ${INVOICE_PRINT_FORMATS[invoicePrintFormat].css}
                            }
                          `}</style>"""
content = re.sub(preview_style_pattern, preview_style_replacement, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
