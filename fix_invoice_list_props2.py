with open("src/components/invoices/InvoicesList.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "renderPersonLink,",
    "renderPersonLink,\n    products, setPricingWizardItems, setPricingWizardInvoice, setSuccessMsg, setReceiptPersonId, setViewingInvoice, handleEditInvoiceAction, handleVoidInvoice,"
)

content = content.replace(
    "const { Search,",
    "const { Tag, Wallet, Ban, ChevronDown, Search,"
)

with open("src/components/invoices/InvoicesList.tsx", "w") as f:
    f.write(content)

with open("src/App.tsx", "r") as f:
    app = f.read()

app = app.replace(
    "Calendar={Calendar} renderPersonLink={renderPersonLink}",
    "Calendar={Calendar} renderPersonLink={renderPersonLink} products={products} setPricingWizardItems={setPricingWizardItems} setPricingWizardInvoice={setPricingWizardInvoice} setSuccessMsg={setSuccessMsg} setReceiptPersonId={setReceiptPersonId} setViewingInvoice={setViewingInvoice} handleEditInvoiceAction={handleEditInvoiceAction} handleVoidInvoice={handleVoidInvoice}"
)

with open("src/App.tsx", "w") as f:
    f.write(app)
