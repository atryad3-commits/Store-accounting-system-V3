import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Select from "react-select";
import {
  List,
  Tag,
  Plus,
  Edit2,
  Trash2,
  Save,
  Search,
  X,
  RefreshCw,
  Database,
  Package,
} from "lucide-react";

interface ProductCategoriesViewProps {
  productCategories: any[];
  products: any[];
  recalculating: boolean;
  submittingProduct?: boolean;
  handleRecalculateStocks: () => void;
  handleGenerateDemoData: () => void;
  addProductCategory: (cat: any) => Promise<any>;
  updateProductCategory: (id: string, cat: any) => Promise<any>;
  deleteProductCategory: (id: string) => Promise<any>;
  getProductCategories: () => Promise<any[]>;
  setProductCategories: (cats: any[]) => void;
  confirmAction: (msg: string, callback: () => void) => void;
  setSuccessMsg: (msg: string) => void;
}

export default function ProductCategoriesView({
  productCategories,
  products,
  recalculating,
  submittingProduct,
  handleRecalculateStocks,
  handleGenerateDemoData,
  addProductCategory,
  updateProductCategory,
  deleteProductCategory,
  getProductCategories,
  setProductCategories,
  confirmAction,
  setSuccessMsg,
}: ProductCategoriesViewProps) {
  const [categorySearch, setCategorySearch] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatParentId, setNewCatParentId] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Filter search results
  const filteredCats = useMemo(() => {
    return productCategories.filter(
      (c) =>
        (c.name || "")
          .toLowerCase()
          .includes(categorySearch.toLowerCase()) ||
        (c.description || "")
          .toLowerCase()
          .includes(categorySearch.toLowerCase())
    );
  }, [productCategories, categorySearch]);

  // Resets the category form
  const resetCategoryForm = () => {
    setNewCatName("");
    setNewCatDesc("");
    setNewCatParentId("");
    setEditingCategoryId(null);
  };

  const handleSaveCategory = async () => {
    if (!newCatName) return;

    try {
      if (editingCategoryId) {
        await updateProductCategory(editingCategoryId, {
          name: newCatName,
          description: newCatDesc,
          parentId: newCatParentId || null,
        });
        setSuccessMsg("گروه‌بندی با موفقیت ویرایش شد.");
      } else {
        const codechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let newCode = "";
        for (let i = 0; i < 3; i++) {
          newCode += codechars.charAt(
            Math.floor(Math.random() * codechars.length)
          );
        }
        await addProductCategory({
          code: newCode,
          name: newCatName,
          description: newCatDesc,
          parentId: newCatParentId || null,
        });
        setSuccessMsg("گروه‌بندی جدید ثبت شد.");
      }
      // re-fetch categories
      const fetchedCats = await getProductCategories();
      setProductCategories(fetchedCats);
      resetCategoryForm();
    } catch (err) {
      console.error("Error saving category", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-right"
      dir="rtl"
    >
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <List className="w-6 h-6 text-indigo-600" />
            مدیریت گروه‌بندی کالاها
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            دسته‌بندی درختی محصولات و خدمات جهت سازماندهی دقیق کالاها، گزارشات سوددهی و انبارگردانی آسان
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={recalculating}
            onClick={handleRecalculateStocks}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded-lg flex items-center gap-2 transition-colors text-sm font-medium cursor-pointer"
            title="محاسبه مجدد موجودی انبارها بر اساس اسناد رسید و حواله"
          >
            <RefreshCw className={`w-4 h-4 ${recalculating ? "animate-spin" : ""}`} />
            محاسبه مجدد موجودی
          </button>
          <button
            onClick={handleGenerateDemoData}
            disabled={submittingProduct}
            className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-lg flex items-center gap-2 transition-colors text-sm font-bold cursor-pointer"
          >
            <Database className="w-4 h-4" />
            ایجاد دیتای نمونه
          </button>
        </div>
      </div>

      {/* Info Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 block mb-1">تعداد کل دسته‌ها</span>
            <span className="text-2xl font-black text-indigo-950 font-mono" dir="ltr">
              {productCategories.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <List className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 block mb-1">گروه‌های اصلی</span>
            <span className="text-2xl font-black text-amber-950 font-mono" dir="ltr">
              {productCategories.filter((c) => !c.parentId).length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 block mb-1">زیرمجموعه‌ها</span>
            <span className="text-2xl font-black text-teal-950 font-mono" dir="ltr">
              {productCategories.filter((c) => c.parentId).length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 block mb-1">کالاهای دسته‌بندی شده</span>
            <span className="text-2xl font-black text-rose-950 font-mono" dir="ltr">
              {products.filter((p) => p.categoryId || p.category).length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right: Registration / Edit Form (cols-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-150 p-6 flex flex-col gap-5 shadow-sm">
          <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
            <h3 className="text-base font-black text-gray-800 flex items-center gap-2">
              {editingCategoryId ? (
                <>
                  <Edit2 className="w-4 h-4 text-emerald-500" />
                  ویرایش گروه‌بندی
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-indigo-500" />
                  ثبت گروه‌بندی جدید
                </>
              )}
            </h3>
            {editingCategoryId && (
              <button
                onClick={resetCategoryForm}
                className="text-xs text-rose-500 hover:text-rose-600 font-extrabold bg-rose-50 hover:bg-rose-100/60 px-2 py-1 rounded-lg border-none cursor-pointer transition-all"
              >
                لغو ویرایش
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Name input */}
            <div>
              <label className="block text-xs font-black text-gray-650 mb-1.5">
                نام گروه کالایی <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="مثال: مواد پروتئینی، لبنیات"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-indigo-950 font-sans font-bold transition-all shadow-xs text-sm outline-none"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Tag className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Parent selection */}
            <div>
              <label className="block text-xs font-black text-gray-650 mb-1.5 flex justify-between items-center">
                <span>گروه والد (زیرمجموعه از)</span>
                <span className="text-[10px] text-gray-400 font-bold">(اختیاری)</span>
              </label>
              <Select
                isRtl
                value={
                  newCatParentId
                    ? {
                        value: newCatParentId,
                        label:
                          productCategories.find(
                            (c) =>
                              c.id === newCatParentId ||
                              c.id.toString() === newCatParentId?.toString()
                          )?.name || "گروه والد",
                      }
                    : null
                }
                onChange={(option) => setNewCatParentId(option ? option.value : "")}
                options={productCategories
                  .filter((c) => c.id !== editingCategoryId)
                  .map((c) => ({
                    value: c.id.toString(),
                    label: c.name,
                  }))}
                placeholder="انتخاب گروه والد..."
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#f8fafc",
                    borderRadius: "12px",
                    borderColor: "#e2e8f0",
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "1.5px",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#f1f5f9",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    fontSize: "13px",
                    fontWeight: "bold",
                    zIndex: 10,
                  }),
                }}
              />
            </div>

            {/* Description input */}
            <div>
              <label className="block text-xs font-black text-gray-650 mb-1.5">
                توضیحات تکمیلی
              </label>
              <textarea
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="یک توضیح کوتاه برای این گروه بنویسید..."
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-indigo-950 font-sans font-medium text-xs leading-relaxed transition-all shadow-xs resize-none outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={!newCatName}
                onClick={() =>
                  confirmAction(
                    editingCategoryId
                      ? "آیا از ثبت تغییرات این گروه کالایی اطمینان دارید؟"
                      : "آیا از ثبت این گروه کالایی جدید اطمینان دارید؟",
                    async () => {
                      await handleSaveCategory();
                    }
                  )
                }
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border-none shadow-md ${
                  newCatName
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 active:scale-98"
                    : "bg-indigo-100 text-indigo-400 cursor-not-allowed"
                }`}
              >
                <Save className="w-4 h-4" />
                {editingCategoryId ? "ذخیره تغییرات گروه" : "ثبت گروه جدید"}
              </button>
            </div>
          </div>
        </div>

        {/* Left: Interactive Categories Tree / Table (cols-8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-150 shadow-sm flex flex-col overflow-hidden">
          {/* Filter and search bar in header */}
          <div className="p-4 bg-slate-50/50 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="جستجو در نام یا توضیحات گروه..."
                className="w-full pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs font-bold font-sans transition-all shadow-xs outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              {categorySearch && (
                <button
                  onClick={() => setCategorySearch("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-xs text-gray-400 font-bold">
              نمایش <span className="text-indigo-600 font-black">{filteredCats.length}</span> گروه از مجموع{" "}
              <span className="text-slate-800 font-black">{productCategories.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse text-right">
              <thead>
                <tr className="bg-slate-50 text-gray-500 text-xs font-bold border-b border-gray-100 select-none">
                  <th className="p-4 w-[40%]">نام گروه کالایی</th>
                  <th className="p-4 w-[25%]">گروه والد</th>
                  <th className="p-4 w-[15%] text-center">تعداد محصولات</th>
                  <th className="p-4 w-[20%] text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/70 text-gray-700">
                {filteredCats.map((cat) => {
                  const isChild = !!cat.parentId;
                  const parentCat = cat.parentId
                    ? productCategories.find(
                        (p) =>
                          p.id === cat.parentId ||
                          p.id.toString() === cat.parentId?.toString()
                      )
                    : null;
                  const prodQty = products.filter(
                    (p) =>
                      String(p.categoryId) === String(cat.id) ||
                      p.category === cat.name
                  ).length;
                  const isEditingCurrent = editingCategoryId === cat.id;

                  return (
                    <tr
                      key={cat.id}
                      className={`hover:bg-indigo-50/20 transition-all ${
                        isEditingCurrent ? "bg-indigo-50/40" : ""
                      }`}
                    >
                      {/* Category Name */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          {isChild ? (
                            <div className="flex items-center gap-1.5 mr-4 font-bold text-gray-800">
                              <span className="text-indigo-400 font-mono select-none">└─</span>
                              <Tag className="w-3.5 h-3.5 text-slate-400" />
                              <span>{cat.name}</span>
                              {cat.code && (
                                <span className="font-mono text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md border border-gray-200 leading-none">
                                  {cat.code}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 font-extrabold text-indigo-950">
                              <Tag className="w-4 h-4 text-indigo-500" />
                              <span>{cat.name}</span>
                              {cat.code && (
                                <span className="font-mono text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md border border-gray-200 leading-none">
                                  {cat.code}
                                </span>
                              )}
                            </div>
                          )}
                          {cat.description && (
                            <span
                              className={`text-[11px] leading-relaxed max-w-[280px] overflow-hidden text-ellipsis mr-5 block ${
                                isChild ? "mr-10" : "mr-6"
                              } text-gray-400 font-medium`}
                            >
                              {cat.description}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Parent Category */}
                      <td className="p-4">
                        {parentCat ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50/50 px-2 py-1 rounded-lg border border-indigo-100/30">
                            {parentCat.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                            گروه اصلی
                          </span>
                        )}
                      </td>

                      {/* Products count badge */}
                      <td className="p-4 text-center">
                        {prodQty > 0 ? (
                          <span className="font-sans font-black text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100/70 px-2.5 py-1 rounded-xl transition-all border border-indigo-100/30 inline-block min-w-10">
                            {prodQty} کالا
                          </span>
                        ) : (
                          <span className="font-sans font-bold text-xs text-gray-400 bg-gray-50/50 px-2.5 py-1 rounded-xl inline-block min-w-10 border border-transparent">
                            ۰ کالا
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5 no-print">
                          <button
                            title="ویرایش"
                            onClick={() => {
                              setEditingCategoryId(cat.id);
                              setNewCatName(cat.name);
                              setNewCatDesc(cat.description || "");
                              setNewCatParentId(cat.parentId || "");
                            }}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg cursor-pointer border border-transparent bg-transparent transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="حذف"
                            onClick={() =>
                              confirmAction(
                                `آیا از حذف گروه کالایی "${cat.name}" اطمینان دارید؟ با حذف گروه‌بندی، محصولات ثبت‌شده تحت این ردیف بدون دسته‌بندی می‌شوند.`,
                                async () => {
                                  await deleteProductCategory(cat.id);
                                  setSuccessMsg("گروه‌بندی حذف شد.");
                                  const fc = await getProductCategories();
                                  setProductCategories(fc);
                                  if (editingCategoryId === cat.id) {
                                    resetCategoryForm();
                                  }
                                }
                              )
                            }
                            className="p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg cursor-pointer border border-transparent bg-transparent transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredCats.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-gray-400 font-medium">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Tag className="w-8 h-8 text-gray-300" />
                        <span>هیچ گروه کالایی یافت نشد.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
