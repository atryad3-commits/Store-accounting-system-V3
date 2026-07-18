import React, { useState } from 'react';
import { motion } from 'motion/react';
import * as lucide from 'lucide-react';
const { Tag, X, Percent, Check, Printer } = lucide as any;

export default function PricingWizardModal(props: any) {
  const {
    pricingWizardInvoice, setPricingWizardInvoice,
    pricingWizardItems, setPricingWizardItems,
    products, storeSettings, toPersianDigits, formatDateDisplay, formatNumber,
    setSuccessMsg, fetchProducts, updateProduct, List
  } = props;
  
  const [pricingPrintMode, setPricingPrintMode] = useState<"list" | "labels">("list");
  const [bulkProfitMargin, setBulkProfitMargin] = useState<number>(0);
  

  return (
    <>
      {pricingWizardInvoice && (
                <div key="pricingWizardInvoice-modal"
                  className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:block print:overflow-visible overflow-y-auto print-section">
          {/* Interactive UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl ring-1 ring-slate-900/5 print:hidden m-auto"
            dir="rtl"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-lg">
                    قیمت‌گذاری فروش کالاها
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    ثبت قیمت فروش برای اقلام فاکتور خرید اخیر
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPricingWizardInvoice(null);
                  setPricingWizardItems([]);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-200/50 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
              {/* Bulk Update */}
              {pricingWizardItems.length > 0 && (
                <div className="flex flex-col md:flex-row items-center justify-between bg-indigo-50 p-4 border border-indigo-100 rounded-2xl gap-3">
                  <span className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-indigo-500" />
                    اعمال حاشیه سود گروهی روی تمام اقلام کالاها
                  </span>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <span className="text-xs font-bold text-indigo-700 whitespace-nowrap">
                        درصد سود یکسان:
                      </span>
                      <div className="flex flex-1 md:flex-none items-center gap-1 bg-white border border-indigo-200 rounded-xl px-2 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/30 w-32 md:w-28">
                        <input
                          type="number"
                          min="0"
                          placeholder="مثلا 15"
                          className="w-full text-center font-sans font-black text-indigo-700 bg-transparent focus:outline-none text-sm"
                          onChange={(e) => {
                            let value = e.target.value;
                            if (value === "") return;
                            const m = Number(value);
                            if (!isNaN(m)) {
                              const newItems = pricingWizardItems.map(
                                (item) => ({
                                  ...item,
                                  marginPercent: m,
                                  salePrice: item.purchasePrice * (1 + m / 100),
                                }),
                              );
                              setPricingWizardItems(newItems);
                            }
                          }}
                        />
                        <span className="text-xs font-bold text-indigo-400">
                          ٪
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-sm text-right">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 font-extrabold text-slate-700 w-12 text-center">
                        ردیف
                      </th>
                      <th className="p-4 font-extrabold text-slate-700">
                        نام کالا / خدمات
                      </th>
                      <th className="p-4 font-extrabold text-slate-700 w-32 border-r border-slate-100 text-center text-xs">
                        قیمت خرید واحد اصلی<br/><span className="text-[10px] text-slate-400 font-normal">({storeSettings.currency})</span>
                      </th>
                      <th className="p-4 font-extrabold text-slate-700 w-32 border-r border-slate-100 text-center">
                        حاشیه سود (٪)
                      </th>
                      <th className="p-4 font-extrabold text-slate-700 w-44 border-r border-slate-100 text-center text-xs">
                        قیمت فروش واحد اصلی<br/><span className="text-[10px] text-slate-400 font-normal">({storeSettings.currency})</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pricingWizardItems.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="p-4 text-center font-sans font-bold text-slate-500 text-xs text-center border-l border-slate-100/50">
                          {toPersianDigits(idx + 1)}
                        </td>
                        <td className="p-4 font-bold text-slate-800 flex flex-col gap-1">
                          <span>{item.productName}</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            واحد اصلی: {products.find((p: any) => p.id === item.productId)?.unit || '---'}
                          </span>
                        </td>
                        <td className="p-3 border-r border-slate-100 text-center align-middle">
                          <div className="font-sans font-black text-slate-700 text-sm bg-slate-50 border border-slate-200/60 rounded-xl px-2 py-1.5 inline-block">
                            {toPersianDigits(formatNumber(item.purchasePrice))}
                          </div>
                        </td>
                        <td className="p-3 border-r border-slate-100 text-center align-middle">
                          <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-200/60 rounded-xl px-2 py-0.5 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all max-w-[90px] mx-auto">
                            <input
                              type="number"
                              min="0"
                              className="w-full text-center font-sans font-black text-indigo-700 bg-transparent focus:outline-none text-sm py-1"
                              value={item.marginPercent || ""}
                              onChange={(e) => {
                                const m = Number(e.target.value);
                                const newItems = [...pricingWizardItems];
                                newItems[idx].marginPercent = m;
                                newItems[idx].salePrice =
                                  item.purchasePrice * (1 + m / 100);
                                setPricingWizardItems(newItems);
                              }}
                              placeholder="0"
                            />
                            <span className="text-[10px] font-bold text-indigo-400">
                              ٪
                            </span>
                          </div>
                        </td>
                        <td className="p-3 border-r border-slate-100 text-center align-middle relative">
                          <input
                            type="text"
                            className="w-[120px] text-center font-sans font-black text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-sm"
                            value={
                              item.salePrice
                                ? toPersianDigits(formatNumber(item.salePrice))
                                : ""
                            }
                            onChange={(e) => {
                              const raw = Number(
                                e.target.value.replace(/\D/g, ""),
                              );
                              const newItems = [...pricingWizardItems];
                              newItems[idx].salePrice = raw;
                              if (item.purchasePrice > 0) {
                                newItems[idx].marginPercent = Math.round(
                                  ((raw - item.purchasePrice) /
                                    item.purchasePrice) *
                                    100,
                                );
                              }
                              setPricingWizardItems(newItems);
                            }}
                            onFocus={(e) => e.target.select()}
                          />
                        </td>
                      </tr>
                    ))}
                    {pricingWizardItems.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-8 text-center text-slate-500 font-bold"
                        >
                          هیچ کالایی برای تعیین قیمت وجود ندارد.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                با درج حاشیه سود یا تغییر مستقیم، قیمت فروش کالاها به‌روز
                می‌شود.
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPricingWizardInvoice(null);
                    setPricingWizardItems([]);
                  }}
                  className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-sm"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setPricingPrintMode("list");
                    for (const item of pricingWizardItems) {
                      const p = products.find(
                        (prod) => prod.id === item.productId,
                      );
                      if (p) {
                        await updateProduct(p.id.toString(), {
                          ...p,
                          price: item.salePrice,
                          purchasePrice: item.purchasePrice,
                          priceChangeDate: pricingWizardInvoice?.date || new Date().toISOString(),
                        });
                      }
                    }
                    await fetchProducts();
                    setSuccessMsg("قیمت‌های فروش با موفقیت بروزرسانی شد.");
                    setTimeout(() => window.print(), 300);
                  }}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all shadow-indigo-600/20 hover:-translate-y-0.5"
                >
                  <List className="w-5 h-5" />
                  ثبت قیمت و چاپ لیست
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setPricingPrintMode("labels");
                    for (const item of pricingWizardItems) {
                      const p = products.find(
                        (prod) => prod.id === item.productId,
                      );
                      if (p) {
                        await updateProduct(p.id.toString(), {
                          ...p,
                          price: item.salePrice,
                          purchasePrice: item.purchasePrice,
                          priceChangeDate: pricingWizardInvoice?.date || new Date().toISOString(),
                        });
                      }
                    }
                    await fetchProducts();
                    setSuccessMsg("قیمت‌های فروش با موفقیت بروزرسانی شد.");
                    setTimeout(() => window.print(), 300);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-sm transition-all shadow-emerald-600/20 hover:-translate-y-0.5"
                >
                  <Printer className="w-5 h-5" />
                  ثبت قیمت و چاپ لیبل چسبی
                </button>
              </div>
            </div>
          </motion.div>

          {/* Dedicated Print-Only Layout */}
          <div
            className="hidden print:block p-8 w-full mx-auto bg-white font-sans text-slate-800"
            dir="rtl"
          >
            {pricingPrintMode === "list" && (
              <>
                <div className="flex flex-col items-center justify-center pb-6 border-b border-slate-200 mb-6">
                  <h2 className="text-3xl font-black text-slate-900 mb-3">
                    {storeSettings?.storeName || "لیست قیمت فروش کالاها"}
                  </h2>
                  <div className="flex gap-8 text-lg font-bold text-slate-600">
                    <span>
                      مرجع: فاکتور خرید{" "}
                      {toPersianDigits(
                        pricingWizardInvoice?.invoiceNumber || "",
                      )}
                    </span>
                    <span>
                      تاریخ ثبت خرید:{" "}
                      {formatDateDisplay(
                        pricingWizardInvoice?.date || pricingWizardInvoice?.jalaliDate,
                      )}
                    </span>
                    <span>
                      تاریخ قیمت‌گذاری: {formatDateDisplay(new Date())}
                    </span>
                  </div>
                </div>

                <table className="w-full text-lg text-right border-collapse border border-slate-300">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-4 border border-slate-300 font-extrabold w-20 text-center">
                        ردیف
                      </th>
                      <th className="p-4 border border-slate-300 font-extrabold">
                        نام کالا / خدمات
                      </th>
                      <th className="p-4 border border-slate-300 font-extrabold w-64 text-center bg-slate-200">
                        قیمت فروش ({storeSettings?.currency || "تومان"})
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {pricingWizardItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-4 border border-slate-300 text-center font-bold">
                          {toPersianDigits(idx + 1)}
                        </td>
                        <td className="p-4 border border-slate-300 font-bold text-xl">
                          {item.productName}
                        </td>
                        <td
                          className="p-4 border border-slate-300 text-center font-black text-2xl text-slate-900"
                          dir="ltr"
                        >
                          {item.salePrice
                            ? toPersianDigits(formatNumber(item.salePrice))
                            : "---"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {pricingPrintMode === "labels" && (
              <div className="flex flex-wrap gap-4 items-start justify-start">
                {pricingWizardItems.map((item, idx) => {
                  const prod = products.find((p) => p.id === item.productId);
                  return (
                    <div
                      key={idx}
                      className="border-[5px] border-slate-900 p-3 rounded-3xl flex flex-col justify-between text-center w-[95mm] h-[65mm] break-inside-avoid relative overflow-hidden bg-white shadow-sm"
                    >
                      <div className="w-full flex justify-between items-start px-2 mb-1 shrink-0">
                        <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">
                          بارکد: {prod?.barcode || "---"}
                        </span>
                        <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">
                          کد: {prod?.code || "---"}
                        </span>
                      </div>
                      <div className="flex flex-col items-center w-full min-h-0 flex-1 justify-center py-1">
                        <span className="text-sm font-extrabold text-slate-500 mb-1 truncate w-full px-2">
                          {storeSettings?.storeName || "پلتفرم فروشگاهی"}
                        </span>
                        <span
                          className="text-xl md:text-2xl font-black text-slate-900 leading-snug px-2 w-full overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {item.productName}
                        </span>
                      </div>
                      <div className="mt-auto pt-2 w-full flex flex-col items-center border-t-2 border-slate-200 shrink-0 bg-white">
                        <div className="flex items-end justify-center gap-2 mt-1">
                          <span
                            className="text-[32px] md:text-[38px] font-black text-slate-900 tracking-tight leading-none"
                            dir="ltr"
                          >
                            {item.salePrice
                              ? toPersianDigits(formatNumber(item.salePrice))
                              : "---"}
                          </span>
                          <span className="text-lg font-bold text-slate-600 mb-1">
                            {storeSettings?.currency || "تومان"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

    </>
  );
}
