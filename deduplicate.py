with open('src/App.tsx', 'r') as f:
    content = f.read()

dup = """                          <style>{`
                            @media print {
                              ${INVOICE_PRINT_FORMATS[invoicePrintFormat].css}
                            }
                          `}</style>
                          <style>{`
                            @media print {
                              ${INVOICE_PRINT_FORMATS[invoicePrintFormat].css}
                            }
                          `}</style>"""
                          
single = """                          <style>{`
                            @media print {
                              ${INVOICE_PRINT_FORMATS[invoicePrintFormat].css}
                            }
                          `}</style>"""

content = content.replace(dup, single)

with open('src/App.tsx', 'w') as f:
    f.write(content)
