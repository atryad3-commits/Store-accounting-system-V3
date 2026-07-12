const fs = require('fs');
const content = fs.readFileSync('src/components/invoices/InvoicesList.tsx', 'utf8');

const target = `        const filteredInvoicesList = invoices
          .filter((i) => {
            if (activeTab === "list_sale") {
              return i.type === "sale" || i.type === "proforma";
            } else if (activeTab === "list_purchase") {
              if (i.type !== "purchase") return false;
              const isReceived = invoices.some(
                (wh) =>
                  wh.type === "warehouse_receipt" &&
                  wh.sourceInvoiceId?.toString() === i.id.toString(),
              );
              if (purchaseFilter === "received") return isReceived;
              if (purchaseFilter === "pending") return !isReceived;
              return true;
            } else if (activeTab === "list_warehouse_docs") {`;

const replacement = `        const filteredInvoicesList = invoices
          .filter((i) => {
            if (activeTab === "list_sale") {
              if (i.type !== "sale" && i.type !== "proforma") return false;
              
              const isRemitted = invoices.some(
                (wh) =>
                  wh.type === "warehouse_remittance" &&
                  wh.sourceInvoiceId?.toString() === i.id.toString(),
              );
              
              if (invoiceTabFilter === "proforma") return i.type === "proforma";
              if (invoiceTabFilter === "sale") return i.type === "sale";
              if (invoiceTabFilter === "remitted") return i.type === "sale" && isRemitted;
              if (invoiceTabFilter === "pending_remit") return i.type === "sale" && !isRemitted;
              if (invoiceTabFilter === "paid") return i.type === "sale" && i.paymentStatus === "paid";
              if (invoiceTabFilter === "unpaid") return i.type === "sale" && (i.paymentStatus === "unpaid" || i.paymentStatus === "partial");
              
              return true;
            } else if (activeTab === "list_purchase") {
              if (i.type !== "purchase") return false;
              const isReceived = invoices.some(
                (wh) =>
                  wh.type === "warehouse_receipt" &&
                  wh.sourceInvoiceId?.toString() === i.id.toString(),
              );
              
              if (invoiceTabFilter === "received") return isReceived;
              if (invoiceTabFilter === "pending_receive") return !isReceived;
              if (invoiceTabFilter === "paid") return i.paymentStatus === "paid";
              if (invoiceTabFilter === "unpaid") return i.paymentStatus === "unpaid" || i.paymentStatus === "partial";
              
              return true;
            } else if (activeTab === "list_warehouse_docs") {`;

if (content.includes(target)) {
  fs.writeFileSync('src/components/invoices/InvoicesList.tsx', content.replace(target, replacement));
  console.log('Patched filter logic successfully');
} else {
  console.log('Target for filter logic not found');
}
