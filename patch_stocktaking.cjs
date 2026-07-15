const fs = require('fs');
let code = fs.readFileSync('src/components/inventory/StocktakingManager.tsx', 'utf-8');

// 1. Add import
if (!code.includes('FastProductCreateModal')) {
    code = code.replace("import { Stocktaking, StocktakingItem, Product, Warehouse, WarehouseStock } from '../../types';", "import { Stocktaking, StocktakingItem, Product, Warehouse, WarehouseStock } from '../../types';\nimport FastProductCreateModal from '../products/FastProductCreateModal';");
}

// 2. Add State for the modal
if (!code.includes('isProductModalOpen')) {
    code = code.replace("const [showProductDropdown, setShowProductDropdown] = useState(false);", "const [showProductDropdown, setShowProductDropdown] = useState(false);\n  const [isProductModalOpen, setIsProductModalOpen] = useState(false);");
}

// 3. Update the inputs to have onKeyDown
const keyDownHandler = `
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && productSearch.trim()) {
                                const matched = (products || []).filter(p => (p.type === 'product' || !p.type) && (p.name.includes(productSearch) || p.code?.includes(productSearch) || p.barcode?.includes(productSearch)));
                                if (matched.length > 0) {
                                  handleAddProductToCounting(matched[0]);
                                }
                              }
                            }}
`;

// Replace both inputs
code = code.replace(/onFocus=\{\(\) => setShowProductDropdown\(true\)\}/g, "onFocus={() => setShowProductDropdown(true)}" + keyDownHandler);

// 4. Add the "Add Product" button when not found
const addBtnHtml = `
                              <div className="p-4 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
                                کالایی یافت نشد
                                <button onClick={() => setIsProductModalOpen(true)} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">
                                  + افزودن کالای جدید
                                </button>
                              </div>
`;
code = code.replace(/<div className="p-4 text-center text-slate-500 text-sm">کالایی یافت نشد<\/div>/g, addBtnHtml);

// 5. Add the Modal render at the bottom
const modalHtml = `
      {isProductModalOpen && (
        <FastProductCreateModal
          onClose={() => setIsProductModalOpen(false)}
          onSuccess={async (newProduct) => {
             // We just add it to products via reload or maybe the parent will reload
             const updated = await getProducts();
             setProducts(updated.filter((pr: any) => pr.type === 'product' || !pr.type));
             setIsProductModalOpen(false);
             setProductSearch('');
             handleAddProductToCounting(newProduct);
          }}
        />
      )}
    </div>
  );
`;
code = code.replace(/<\/div>\s*<\/div>\s*\);\s*\}\s*$/g, modalHtml + "\n}");

fs.writeFileSync('src/components/inventory/StocktakingManager.tsx', code, 'utf-8');
console.log('patched stocktaking');
