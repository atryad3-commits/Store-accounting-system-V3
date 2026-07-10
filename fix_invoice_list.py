with open("src/components/invoices/InvoicesList.tsx", "r") as f:
    content = f.read()

# content is just the `case ... { return ... }` block
# we need to remove the case labels and wrap it in a function

lines = content.split('\n')
start_idx = 0
for i, line in enumerate(lines):
    if line.strip() == "{":
        start_idx = i + 1
        break
    elif "{" in line:
        start_idx = i
        break

inner_content = "\n".join(lines[start_idx:-2])

imports = """import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as lucide from 'lucide-react';
const { Search, Plus, Filter, FileText, Download, CheckCircle, Edit2, Trash2, Printer, Check, X, ArrowUpRight, ArrowDownRight, ArrowRight, CornerDownLeft, Package, User, Clock, CheckCircle2, ChevronLeft, ChevronRight, Share2, Eye, Truck, MoreVertical, DollarSign, RefreshCw, XCircle } = lucide as any;

export default function InvoicesList(props: any) {
  const {
    invoices, invoiceSearchQuery, setInvoiceSearchQuery, persons, activeTab, setActiveTab,
    purchaseFilter, setPurchaseFilter, formatCurrency, getPersonDisplayName, formatDateDisplay,
    calculateInvoiceTotal, numToPersianWords, setInvoiceWarehouseId, warehouses, setCustomerId,
    handlePrintInvoice, getRoleName, setEditingInvoiceId, handleDeleteInvoice, handleConvertProformaToSale,
    handlePayPurchase, handleReturnSale, handleReturnPurchase, storeSettings,
    invoiceCurrentPage, setInvoiceCurrentPage, invoicePageSize, setInvoicePageSize, toPersianDigits,
    ...rest
  } = props;
"""

with open("src/components/invoices/InvoicesList.tsx", "w") as f:
    f.write(imports + "\n" + inner_content + "\n}\n")
