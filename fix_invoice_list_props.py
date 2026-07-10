with open("src/components/invoices/InvoicesList.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "invoiceCurrentPage, setInvoiceCurrentPage, invoicePageSize, setInvoicePageSize, toPersianDigits,",
    "invoiceCurrentPage, setInvoiceCurrentPage, invoicePageSize, setInvoicePageSize, toPersianDigits,\n    listFilter, setListFilter, invoiceGroupMode, setInvoiceGroupMode, List, clearDraft, setInvoiceType, setWarehouseOperationType, Calendar, renderPersonLink,"
)

with open("src/components/invoices/InvoicesList.tsx", "w") as f:
    f.write(content)
