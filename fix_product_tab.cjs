const fs = require('fs');
const file = 'src/components/products/ProductsTab.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove "ثبت سریع موبایلی"
content = content.replace(
  /<button[\s\S]*?ثبت سریع موبایلی[\s\S]*?<\/button>/,
  ''
);

// 2. Remove "تغییر قیمت سریع"
content = content.replace(
  /<button\s+onClick=\{\(\) => setPriceChangeProduct\(p\)\}[\s\S]*?تغییر قیمت سریع\s*<\/button>/,
  ''
);

// 3. Remove "چاپ بارکد" from row menu
content = content.replace(
  /<button\s+onClick=\{\(\) =>\s*setPrintingBarcodeProduct\(p\)\s*\}[\s\S]*?چاپ بارکد\s*<\/button>/,
  ''
);

// 4. Add top bar buttons for selected products
const topBarButtons = `
{selectedProductIds.length > 0 && (
  <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 mr-2">
    <span className="text-sm font-bold text-indigo-700">{toPersianDigits(selectedProductIds.length)} مورد انتخاب شده:</span>
    <button
      onClick={() => setIsGroupPriceModalOpen(true)}
      className="px-3 py-1.5 bg-white hover:bg-indigo-100 text-indigo-600 rounded-lg flex items-center gap-2 transition-colors text-sm font-bold border border-indigo-200 shadow-sm"
    >
      <Tag className="w-4 h-4" />
      تغییر قیمت
    </button>
    <button
      onClick={() => setPrintingBarcodeProduct(filteredProducts.filter(p => selectedProductIds.includes(p.id)))}
      className="px-3 py-1.5 bg-white hover:bg-indigo-100 text-indigo-600 rounded-lg flex items-center gap-2 transition-colors text-sm font-bold border border-indigo-200 shadow-sm"
    >
      <Printer className="w-4 h-4" />
      چاپ بارکد
    </button>
  </div>
)}
`;

content = content.replace(
  /<div className="flex flex-wrap items-center gap-2">/,
  '<div className="flex flex-wrap items-center gap-2">' + topBarButtons
);

fs.writeFileSync(file, content);
