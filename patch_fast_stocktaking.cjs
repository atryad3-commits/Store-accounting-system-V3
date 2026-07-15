const fs = require('fs');
let code = fs.readFileSync('src/components/inventory/FastStocktakingMobile.tsx', 'utf-8');

// 1. Imports
code = code.replace(
  'addProduct\n} from "../../services/dataService";',
  'addProduct,\n  getProductCategories\n} from "../../services/dataService";'
);

// 2. State
const stateToAdd = `
  const [categories, setCategories] = useState<any[]>([]);
  const [newProductCategoryId, setNewProductCategoryId] = useState("");
  const [newProductUnit, setNewProductUnit] = useState("عدد");
`;
code = code.replace(
  'const [isCreatingProduct, setIsCreatingProduct] = useState(false);',
  'const [isCreatingProduct, setIsCreatingProduct] = useState(false);\n' + stateToAdd
);

// 3. loadInit
code = code.replace(
  'const p = await getProducts();',
  'const p = await getProducts();\n        const cats = await getProductCategories();\n        setCategories(cats);'
);

// 4. handleCreateProduct
code = code.replace(
  'unit: "عدد",',
  'unit: newProductUnit,\n        categoryId: newProductCategoryId,'
);

code = code.replace(
  'setNewProductName("");\n      setNewProductCode("");',
  'setNewProductName("");\n      setNewProductCode("");\n      setNewProductCategoryId("");\n      setNewProductUnit("عدد");'
);

// 5. Form UI
const formOld = `               <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">کد کالا / بارکد (اختیاری)</label>
                  <input type="text" value={newProductCode} onChange={e => setNewProductCode(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 font-mono" dir="ltr" />
               </div>`;

const formNew = `               <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">کد کالا / بارکد (اختیاری)</label>
                  <input type="text" value={newProductCode} onChange={e => setNewProductCode(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 font-mono" dir="ltr" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">دسته‌بندی (گروه کالا)</label>
                  <select value={newProductCategoryId} onChange={e => setNewProductCategoryId(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500">
                    <option value="">بدون دسته‌بندی</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">واحد اندازه‌گیری</label>
                  <input type="text" value={newProductUnit} onChange={e => setNewProductUnit(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500" placeholder="مثال: عدد، کیلوگرم، متر" />
               </div>`;

code = code.replace(formOld, formNew);

fs.writeFileSync('src/components/inventory/FastStocktakingMobile.tsx', code, 'utf-8');
console.log('Patch complete.');
