with open("src/App.tsx", "r") as f:
    app = f.read()

imports = """import CurrencyInput from './components/common/CurrencyInput';
import FastBarcodeScanner from './components/common/FastBarcodeScanner';
import PersonLedgerActionsDropdown from './components/persons/PersonLedgerActionsDropdown';
"""
app = imports + app

with open("src/App.tsx", "w") as f:
    f.write(app)
