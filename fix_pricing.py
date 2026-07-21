with open('src/components/modals/PricingWizardModal.tsx', 'r') as f:
    c = f.read()

# Update PRINT_FORMATS
old_a4 = "css: `@page { size: A4; margin: 10mm; } .print-labels-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2mm; } .label-item { height: 35mm; }`"
new_a4 = "css: `@page { size: A4; margin: 10mm; } .print-labels-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; } .label-item { height: 52mm; page-break-inside: avoid; }`"
c = c.replace(old_a4, new_a4)

old_a5 = "css: `@page { size: A5; margin: 5mm; } .print-labels-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2mm; } .label-item { height: 32mm; }`"
new_a5 = "css: `@page { size: A5; margin: 5mm; } .print-labels-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 3mm; } .label-item { height: 37mm; page-break-inside: avoid; }`"
c = c.replace(old_a5, new_a5)

# Inject <style> block
old_return = "return (\n    <>\n      {pricingWizardInvoice && ("
new_return = """return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { position: absolute; left: 0; top: 0; width: 100%; }
          ${selectedFormat.css}
        }
      `}</style>
      {pricingWizardInvoice && ("""
c = c.replace(old_return, new_return)

with open('src/components/modals/PricingWizardModal.tsx', 'w') as f:
    f.write(c)
