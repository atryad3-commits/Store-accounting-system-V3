const fs = require('fs');
let code = fs.readFileSync('src/components/modals/ProductCardModal.tsx', 'utf-8');

const oldUseMemo = `  const recentPriceChanges = useMemo(() => {
    const changes: any[] = [];
    for (const h of priceHistory) {
       const price = Number(h.price);
       if (changes.length === 0 || Number(changes[changes.length - 1].price) !== price) {
          changes.push(h);
       }
       if (changes.length >= 3) break;
    }
    return changes;
  }, [priceHistory]);`;

const newUseMemo = `  const { recentSalePriceChanges, recentPurchasePriceChanges } = useMemo(() => {
    const saleChanges: any[] = [];
    const purchaseChanges: any[] = [];
    for (const h of priceHistory) {
       const price = Number(h.price);
       if (h.type === 'sale') {
           if (saleChanges.length === 0 || Number(saleChanges[saleChanges.length - 1].price) !== price) {
              saleChanges.push(h);
           }
       } else if (h.type === 'purchase') {
           if (purchaseChanges.length === 0 || Number(purchaseChanges[purchaseChanges.length - 1].price) !== price) {
              purchaseChanges.push(h);
           }
       }
    }
    return { 
       recentSalePriceChanges: saleChanges.slice(0, 3), 
       recentPurchasePriceChanges: purchaseChanges.slice(0, 3) 
    };
  }, [priceHistory]);`;

const oldRender = `                 {!loading && recentPriceChanges.length > 0 && (
                   <div className="mb-0 bg-white border border-slate-200 p-4 rounded-xl shadow-sm mt-6">
                     <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                       <BarChart2 className="w-5 h-5 text-indigo-500" />
                       آخرین تغییرات قیمت (۳ تغییر اخیر)
                     </h4>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                       {recentPriceChanges.map((change, index) => (
                         <div key={index} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                           <div className="flex items-center gap-3 relative z-10">
                              <div className={\`w-8 h-8 rounded-lg flex items-center justify-center \${change.type === 'sale' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}\`}>
                                 {change.type === 'sale' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              </div>
                              <div className="flex flex-col text-right">
                                 <span className="text-[10px] font-bold text-slate-500">{change.type === 'sale' ? 'فروش' : 'خرید'}</span>
                                 <span className="text-xs font-bold text-slate-700">{change.date}</span>
                              </div>
                           </div>
                           <div className="font-sans font-black text-indigo-700 text-left relative z-10" dir="ltr">
                              {Number(change.price).toLocaleString()} <span className="text-[9px] font-normal font-sans text-slate-500 block text-right mt-0.5">{currency}</span>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}`;

const newRender = `                 {!loading && (recentSalePriceChanges.length > 0 || recentPurchasePriceChanges.length > 0) && (
                   <div className="mb-0 bg-white border border-slate-200 p-4 rounded-xl shadow-sm mt-6">
                     <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                       <BarChart2 className="w-5 h-5 text-indigo-500" />
                       آخرین تغییرات قیمت (۳ تغییر اخیر)
                     </h4>
                     
                     {recentSalePriceChanges.length > 0 && (
                       <div className="mb-4">
                         <h5 className="text-xs font-bold text-emerald-600 mb-2 border-b border-slate-100 pb-1">تغییرات قیمت فروش</h5>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                           {recentSalePriceChanges.map((change, index) => (
                             <div key={index} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                               <div className="flex items-center gap-3 relative z-10">
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-600">
                                     <TrendingUp className="w-4 h-4" />
                                  </div>
                                  <div className="flex flex-col text-right">
                                     <span className="text-[10px] font-bold text-slate-500">فروش</span>
                                     <span className="text-xs font-bold text-slate-700">{formatDateDisplay(change.date)}</span>
                                  </div>
                               </div>
                               <div className="font-sans font-black text-indigo-700 text-left relative z-10" dir="ltr">
                                  {Number(change.price).toLocaleString()} <span className="text-[9px] font-normal font-sans text-slate-500 block text-right mt-0.5">{currency}</span>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}

                     {recentPurchasePriceChanges.length > 0 && (
                       <div>
                         <h5 className="text-xs font-bold text-rose-600 mb-2 border-b border-slate-100 pb-1">تغییرات قیمت خرید</h5>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                           {recentPurchasePriceChanges.map((change, index) => (
                             <div key={index} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                               <div className="flex items-center gap-3 relative z-10">
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-100 text-rose-600">
                                     <TrendingDown className="w-4 h-4" />
                                  </div>
                                  <div className="flex flex-col text-right">
                                     <span className="text-[10px] font-bold text-slate-500">خرید</span>
                                     <span className="text-xs font-bold text-slate-700">{formatDateDisplay(change.date)}</span>
                                  </div>
                               </div>
                               <div className="font-sans font-black text-indigo-700 text-left relative z-10" dir="ltr">
                                  {Number(change.price).toLocaleString()} <span className="text-[9px] font-normal font-sans text-slate-500 block text-right mt-0.5">{currency}</span>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                 )}`;

if (code.includes(oldUseMemo)) {
    code = code.replace(oldUseMemo, newUseMemo);
    code = code.replace(oldRender, newRender);
    fs.writeFileSync('src/components/modals/ProductCardModal.tsx', code, 'utf-8');
    console.log('Patched ProductCardModal');
} else {
    console.log('Could not find hooks in ProductCardModal');
}
