with open("src/App.tsx", "r") as f:
    app = f.read()

import_statement = "import PricingWizardModal from './components/modals/PricingWizardModal';\n"
app = import_statement + app

# Replace the block
import re

start_str = '{pricingWizardInvoice && ('
end_str = '{isAccountingDocModalOpen && viewingAccountingDoc && ('

start_idx = app.find(start_str)
end_idx = app.find(end_str)

replacement = """<PricingWizardModal
        pricingWizardInvoice={pricingWizardInvoice} setPricingWizardInvoice={setPricingWizardInvoice} pricingWizardItems={pricingWizardItems} setPricingWizardItems={setPricingWizardItems} products={products} storeSettings={storeSettings} toPersianDigits={toPersianDigits} formatDateDisplay={formatDateDisplay} formatNumber={formatNumber} updateProductSalePrice={updateProductSalePrice} setSuccessMsg={setSuccessMsg} fetchProducts={fetchProducts}
      />
      """
      
app = app[:start_idx] + replacement + app[end_idx:]

with open("src/App.tsx", "w") as f:
    f.write(app)
