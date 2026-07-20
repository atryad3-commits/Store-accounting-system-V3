import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add a state for invoice print format in App component
state_insertion = """  const [invoicePrintFormat, setInvoicePrintFormat] = useState<'a4' | 'a5' | 'pos80'>('a4');
  
  const INVOICE_PRINT_FORMATS = {
    a4: { name: 'کاغذ A4', css: `@page { size: A4 portrait; margin: 5mm; } .print-section { width: 210mm !important; }` },
    a5: { name: 'کاغذ A5', css: `@page { size: A5 portrait; margin: 5mm; } .print-section { width: 148mm !important; font-size: 0.85em; }` },
    pos80: { name: 'فیش پرینتر (80mm)', css: `@page { size: 80mm auto; margin: 1mm; } .print-section { width: 78mm !important; padding: 2mm !important; font-size: 0.75em; } .print-section table { font-size: 0.85em; }` }
  };
"""

# Let's find a good place to put this state in App.tsx
app_start = content.find('export default function App() {')
if app_start != -1:
    vars_start = content.find('const appState = useAppController();', app_start)
    if vars_start != -1:
        content = content[:vars_start] + state_insertion + content[vars_start:]

with open('src/App.tsx', 'w') as f:
    f.write(content)
