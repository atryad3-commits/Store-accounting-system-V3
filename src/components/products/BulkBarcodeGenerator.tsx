import React, { useState, useEffect } from "react";
import { Check, Package, Search, Filter, RefreshCw, Printer, AlertCircle, Settings } from "lucide-react";

export default function BulkBarcodeGenerator({
  products,
  categories,
  toPersianDigits,
  updateProduct,
  fetchProducts,
  storeSettings
}: any) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [barcodeFormat, setBarcodeFormat] = useState("numeric_only");
  const [barcodePrefix, setBarcodePrefix] = useState("");
  const [barcodeLength, setBarcodeLength] = useState("8");
  const [barcodeStartNumber, setBarcodeStartNumber] = useState<number>(1000);
  const [generating, setGenerating] = useState(false);
  
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMissingOnly, setFilterMissingOnly] = useState(true);

  const filteredProducts = products.filter((p: any) => {
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    if (filterMissingOnly && p.barcode && p.barcode.trim() !== "") return false;
    if (searchQuery) {
      return p.name.includes(searchQuery) || p.code?.includes(searchQuery);
    }
    return true;
  });

  const toggleProduct = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p: any) => p.id));
    }
  };

  const handleGenerate = async () => {
    if (selectedProducts.length === 0) {
       alert("لطفا حداقل یک کالا را انتخاب کنید");
       return;
    }
    
    setGenerating(true);
    let currentNumber = Number(barcodeStartNumber) || 1000;
    let updatedCount = 0;

    try {
      for (const productId of selectedProducts) {
        const p = products.find((x: any) => x.id === productId);
        if (!p) continue;
        
        let newBarcode = "";
        if (barcodeFormat === "prefix_serial") {
          newBarcode = `${barcodePrefix}${String(currentNumber).padStart(Number(barcodeLength), "0")}`;
          currentNumber++;
        } else if (barcodeFormat === "numeric_only") {
          newBarcode = `${String(currentNumber).padStart(Number(barcodeLength), "0")}`;
          currentNumber++;
        } else if (barcodeFormat === "random_alphanumeric") {
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          let result = barcodePrefix;
          for (let i = 0; i < Number(barcodeLength); i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          newBarcode = result;
        } else if (barcodeFormat === "uuid") {
          newBarcode = Math.random().toString(36).substring(2, 10).toUpperCase();
        }

        await updateProduct(p.id, { barcode: newBarcode });
        updatedCount++;
      }
      
      alert(`تعداد ${toPersianDigits(updatedCount)} بارکد با موفقیت تولید و ثبت شد.`);
      setSelectedProducts([]);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert("خطا در تولید بارکدها");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-indigo-500" />
            تولید گروهی بارکد
          </h1>
          <p className="text-slate-500 mt-1 font-medium">ایجاد و تخصیص هوشمند بارکد به کالاها</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-500" />
              تنظیمات تولید بارکد
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">فرمت بارکد</label>
                <select
                  value={barcodeFormat}
                  onChange={(e) => setBarcodeFormat(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                >
                  <option value="numeric_only">عدد تصادفی / سریال</option>
                  <option value="prefix_serial">پیشوند + سریال</option>
                  <option value="random_alphanumeric">حروف و اعداد تصادفی</option>
                  <option value="uuid">شناسه کوتاه یکتا</option>
                </select>
              </div>

              {(barcodeFormat === "prefix_serial" || barcodeFormat === "random_alphanumeric") && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">پیشوند (اختیاری)</label>
                  <input
                    type="text"
                    value={barcodePrefix}
                    onChange={(e) => setBarcodePrefix(e.target.value)}
                    placeholder="مثال: PRD"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-left dir-ltr"
                  />
                </div>
              )}

              {(barcodeFormat === "prefix_serial" || barcodeFormat === "numeric_only") && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">شماره شروع سریال</label>
                  <input
                    type="number"
                    value={barcodeStartNumber || ''}
                    onChange={(e) => setBarcodeStartNumber(Number(e.target.value))}
                    placeholder="مثال: 1000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-left dir-ltr"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">طول بارکد / تعداد ارقام سریال</label>
                <input
                  type="number"
                  value={barcodeLength}
                  onChange={(e) => setBarcodeLength(e.target.value)}
                  placeholder="مثال: 8"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-left dir-ltr"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || selectedProducts.length === 0}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              {generating ? (
                <span className="animate-pulse">در حال تولید...</span>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  تولید برای {toPersianDigits(selectedProducts.length)} کالا
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="جستجو کالا..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
            >
              <option value="all">همه دسته‌بندی‌ها</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <button
              onClick={() => setFilterMissingOnly(!filterMissingOnly)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${filterMissingOnly ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
            >
              فقط بدون بارکد
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 w-12">
                      <input 
                        type="checkbox" 
                        checked={selectedProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                        onChange={selectAll}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-500">کد</th>
                    <th className="p-4 text-xs font-bold text-slate-500">نام کالا</th>
                    <th className="p-4 text-xs font-bold text-slate-500">دسته‌بندی</th>
                    <th className="p-4 text-xs font-bold text-slate-500">بارکد فعلی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p: any) => (
                    <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${selectedProducts.includes(p.id) ? 'bg-indigo-50/30' : ''}`}>
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          checked={selectedProducts.includes(p.id)}
                          onChange={() => toggleProduct(p.id)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-700">{toPersianDigits(p.code)}</td>
                      <td className="p-4 text-sm font-bold text-slate-900">{p.name}</td>
                      <td className="p-4 text-sm text-slate-600">
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-xs">{p.category}</span>
                      </td>
                      <td className="p-4">
                        {p.barcode ? (
                          <span className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">{p.barcode}</span>
                        ) : (
                          <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-md">ندارد</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                        کالایی یافت نشد
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
