with open("src/components/financial/ReceiptsList.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "renderPersonLink, storeSettings,",
    "renderPersonLink, storeSettings, List, setActiveTab, invoiceSearchQuery, setInvoiceSearchQuery, toPersianDigits, accounts, cashboxes, formatNumber, numToPersianWords, openPayslip, setPrintingTransaction, setEditingReceipt, setIsEditReceiptModalOpen, confirmAction, deleteTransaction, fetchTransactions,"
)

with open("src/components/financial/ReceiptsList.tsx", "w") as f:
    f.write(content)

with open("src/App.tsx", "r") as f:
    app = f.read()

app = app.replace(
    "renderPersonLink={renderPersonLink} storeSettings={storeSettings}",
    "renderPersonLink={renderPersonLink} storeSettings={storeSettings} List={List} setActiveTab={setActiveTab} invoiceSearchQuery={invoiceSearchQuery} setInvoiceSearchQuery={setInvoiceSearchQuery} toPersianDigits={toPersianDigits} accounts={accounts} cashboxes={cashboxes} formatNumber={formatNumber} numToPersianWords={numToPersianWords} openPayslip={openPayslip} setPrintingTransaction={setPrintingTransaction} setEditingReceipt={setEditingReceipt} setIsEditReceiptModalOpen={setIsEditReceiptModalOpen} confirmAction={confirmAction} deleteTransaction={deleteTransaction} fetchTransactions={fetchTransactions}"
)

with open("src/App.tsx", "w") as f:
    f.write(app)
