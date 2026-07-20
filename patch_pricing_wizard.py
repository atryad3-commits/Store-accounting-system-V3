import re

with open('src/components/modals/PricingWizardModal.tsx', 'r') as f:
    content = f.read()

# We'll replace the state and buttons part.
# First, add the format selector state
state_match = re.search(r'const \[pricingPrintMode, setPricingPrintMode\] = useState<"list" \| "labels">\("list"\);', content)
if state_match:
    format_state_code = """const [pricingPrintMode, setPricingPrintMode] = useState<"list" | "labels">("list");
  const [printFormatId, setPrintFormatId] = useState('a4');

  const PRINT_FORMATS = [
    { 
      id: 'a4', 
      name: 'برگه A4 (۴ ستونه)', 
      css: `@page { size: A4; margin: 10mm; } .print-labels-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2mm; } .label-item { height: 35mm; }`
    },
    { 
      id: 'a5', 
      name: 'برگه A5 (۲ ستونه)', 
      css: `@page { size: A5; margin: 5mm; } .print-labels-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2mm; } .label-item { height: 32mm; }`
    },
    { 
      id: 'label_50x30', 
      name: 'لیبل پرینتر (۵۰x۳۰ میلی‌متر)', 
      css: `@page { size: 50mm 30mm; margin: 0; } .print-labels-container { display: block; } .label-item { width: 48mm; height: 28mm; margin: 1mm auto; page-break-after: always; border: none !important; }`
    },
    { 
      id: 'label_80x40', 
      name: 'لیبل پرینتر (۸۰x۴۰ میلی‌متر)', 
      css: `@page { size: 80mm 40mm; margin: 0; } .print-labels-container { display: block; } .label-item { width: 78mm; height: 38mm; margin: 1mm auto; page-break-after: always; border: none !important; }`
    },
  ];
  
  const selectedFormat = PRINT_FORMATS.find(f => f.id === printFormatId) || PRINT_FORMATS[0];
"""
    content = content[:state_match.start()] + format_state_code + content[state_match.end():]

with open('src/components/modals/PricingWizardModal.tsx', 'w') as f:
    f.write(content)
