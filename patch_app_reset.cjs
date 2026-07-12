const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  useEffect(() => {
    setInvoiceCurrentPage(1);
  }, [
    activeTab,
    invoiceGroupMode,
    listFilter,
    invoiceSearchQuery,
    purchaseFilter,
  ]);`;

const replacement = `  useEffect(() => {
    setInvoiceCurrentPage(1);
  }, [
    activeTab,
    invoiceGroupMode,
    listFilter,
    invoiceSearchQuery,
    purchaseFilter,
  ]);

  useEffect(() => {
    // Reset filters when changing tabs to prevent them from affecting each other
    setInvoiceSearchQuery("");
    setListFilter("all");
    setPurchaseFilter("all");
  }, [activeTab]);`;

if (content.includes(target)) {
  fs.writeFileSync('src/App.tsx', content.replace(target, replacement));
  console.log('Patched App.tsx successfully');
} else {
  console.log('Target for App.tsx not found');
}
