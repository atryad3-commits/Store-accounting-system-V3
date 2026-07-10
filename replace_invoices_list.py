with open("src/App.tsx", "r") as f:
    app = f.read()

import_statement = "import InvoicesList from './components/invoices/InvoicesList';\n"
app = import_statement + app

# Replace the block
import re

start_str = 'case "list_warehouse_docs": {'
end_str = 'case "create_receive_receipt":'

start_idx = app.find(start_str)
end_idx = app.find(end_str)

replacement = """case "list_warehouse_docs": {
        return (
          <InvoicesList
             invoices={invoices} invoiceSearchQuery={invoiceSearchQuery} setInvoiceSearchQuery={setInvoiceSearchQuery} persons={persons} activeTab={activeTab} setActiveTab={setActiveTab} purchaseFilter={purchaseFilter} setPurchaseFilter={setPurchaseFilter} formatCurrency={formatCurrency} getPersonDisplayName={getPersonDisplayName} formatDateDisplay={formatDateDisplay} calculateInvoiceTotal={calculateInvoiceTotal} numToPersianWords={numToPersianWords} setInvoiceWarehouseId={setInvoiceWarehouseId} warehouses={warehouses} setCustomerId={setCustomerId} handlePrintInvoice={handlePrintInvoice} getRoleName={getRoleName} setEditingInvoiceId={setEditingInvoiceId} handleDeleteInvoice={handleDeleteInvoice} handleConvertProformaToSale={handleConvertProformaToSale} handlePayPurchase={handlePayPurchase} handleReturnSale={handleReturnSale} handleReturnPurchase={handleReturnPurchase} storeSettings={storeSettings} invoiceCurrentPage={invoiceCurrentPage} setInvoiceCurrentPage={setInvoiceCurrentPage} invoicePageSize={invoicePageSize} setInvoicePageSize={setInvoicePageSize} toPersianDigits={toPersianDigits} listFilter={listFilter} setListFilter={setListFilter} invoiceGroupMode={invoiceGroupMode} setInvoiceGroupMode={setInvoiceGroupMode} List={List} clearDraft={clearDraft} setInvoiceType={setInvoiceType} setWarehouseOperationType={setWarehouseOperationType} Calendar={Calendar} renderPersonLink={renderPersonLink}
          />
        );
      }
      """
      
app = app[:start_idx] + replacement + app[end_idx:]

with open("src/App.tsx", "w") as f:
    f.write(app)
