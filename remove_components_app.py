with open("src/App.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if line.startswith("const CurrencyInput = ({") or line.startswith("const FastBarcodeScanner = (") or line.startswith("function PersonLedgerActionsDropdown({"):
        skip = True
    
    if not skip:
        new_lines.append(line)
        
    if skip and line.startswith("};") and lines[i-1].strip() == "</div>":
        skip = False
    elif skip and line.startswith("}") and "PersonLedgerActionsDropdown" in new_lines[-1] if len(new_lines)>0 else False:
        # Actually it's better to just use sed or string replace based on exact block 
        pass
