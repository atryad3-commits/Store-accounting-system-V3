import sys

with open('src/components/modals/ProductCardModal.tsx', 'r') as f:
    content = f.read()

# 1. Update activeTab useState
target_state = "const [activeTab, setActiveTab] = useState<'info' | 'financial' | 'warehouse' | 'price_chart' | 'persons'>('info');"
replacement_state = "const [activeTab, setActiveTab] = useState<'info' | 'sales' | 'purchases' | 'warehouse' | 'price_chart' | 'persons'>('info');"
content = content.replace(target_state, replacement_state)

# 3. Update tabs
target_tabs = """            <button
               onClick={() => setActiveTab('financial')}
               className={`pb-3 font-bold text-sm whitespace-nowrap transition-colors relative ${activeTab === 'financial' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'}`}
            >
               فاکتورهای خرید و فروش
               {activeTab === 'financial' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></span>}
            </button>"""

replacement_tabs = """            <button
               onClick={() => setActiveTab('sales')}
               className={`pb-3 font-bold text-sm whitespace-nowrap transition-colors relative ${activeTab === 'sales' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'}`}
            >
               فاکتورهای فروش
               {activeTab === 'sales' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></span>}
            </button>
            <button
               onClick={() => setActiveTab('purchases')}
               className={`pb-3 font-bold text-sm whitespace-nowrap transition-colors relative ${activeTab === 'purchases' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'}`}
            >
               فاکتورهای خرید
               {activeTab === 'purchases' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></span>}
            </button>"""
content = content.replace(target_tabs, replacement_tabs)

# 4. Update table
target_table = """            {activeTab === 'financial' && (
              <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                {loading ? (
                   <div className="text-center py-10 text-gray-400 font-bold animate-pulse">در حال استخراج سوابق ...</div>
                ) : history.filter(h => h.type === 'sale' || h.type === 'purchase' || h.type === 'opening_balance').length === 0 ? (
                   <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-gray-100">فاکتوری برای این کالا ثبت نشده است.</div>
                ) : (
                   <div className="overflow-x-auto border border-gray-100 rounded-xl shadow-sm">
                     <table className="w-full text-right text-sm">
                       <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                         <tr>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">نوع تراکنش</th>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">تاریخ</th>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">شماره سند</th>
                           <th className="px-4 py-3 font-semibold text-xs">شخص / مشتری</th>
                           <th className="px-4 py-3 font-semibold text-xs">انبار</th>
                           <th className="px-4 py-3 font-semibold text-xs">واحد</th>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">مقدار</th>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">فی ({currency})</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50 bg-white">
                         {history.filter(h => h.type === 'sale' || h.type === 'purchase' || h.type === 'opening_balance').map((h, i) => (
                           <tr key={i} className="hover:bg-gray-50 transition-colors">
                             <td className="px-4 py-3 font-bold whitespace-nowrap">
                                {h.type === 'sale' ? (
                                   <span className="text-emerald-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> فروش</span>
                                ) : h.type === 'purchase' ? (
                                   <span className="text-rose-600 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> خرید</span>
                                ) : (
                                   <span className="text-amber-600 flex items-center gap-1"><Package className="w-3 h-3" /> موجودی اول دوره</span>
                                )}
                             </td>
                             <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{h.date}</td>
                             <td className="px-4 py-3 text-gray-500 text-xs font-mono">{h.invoiceNumber || '---'}</td>
                             <td className="px-4 py-3 font-bold text-gray-800 text-xs truncate max-w-[150px]">{h.personName || '---'}</td>
                             <td className="px-4 py-3 text-xs text-gray-600">
                                {warehouses?.find(w => String(w.id) === String(h.warehouseId))?.name || '---'}
                             </td>
                             <td className="px-4 py-3 text-xs font-medium text-gray-500">
                                {h.isSecondaryUnit ? product.secondaryUnit : product.unit}
                             </td>
                             <td className="px-4 py-3 font-bold font-mono">
                                <span className={h.type === 'sale' ? 'text-rose-600' : 'text-emerald-600'} dir="ltr">
                                   {h.type === 'sale' ? '-' : '+'}{formatNum(h.quantity)}
                                </span>
                             </td>
                             <td className="px-4 py-3 font-black text-indigo-700">{Number(h.unitPrice).toLocaleString()}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                )}
              </motion.div>
            )}"""

replacement_table = """            {activeTab === 'sales' && (
              <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                {loading ? (
                   <div className="text-center py-10 text-gray-400 font-bold animate-pulse">در حال استخراج سوابق ...</div>
                ) : history.filter(h => h.type === 'sale').length === 0 ? (
                   <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-gray-100">فاکتور فروشی برای این کالا ثبت نشده است.</div>
                ) : (
                   <div className="overflow-x-auto border border-gray-100 rounded-xl shadow-sm">
                     <table className="w-full text-right text-sm">
                       <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                         <tr>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">تاریخ</th>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">شماره سند</th>
                           <th className="px-4 py-3 font-semibold text-xs">مشتری</th>
                           <th className="px-4 py-3 font-semibold text-xs">انبار</th>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">تعداد ({product.unit})</th>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">فی ({currency})</th>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">مبلغ کل ({currency})</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50 bg-white">
                         {history.filter(h => h.type === 'sale').map((h, i) => (
                           <tr key={i} className="hover:bg-gray-50 transition-colors">
                             <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{h.date}</td>
                             <td className="px-4 py-3 text-gray-500 text-xs font-mono">{h.invoiceNumber || '---'}</td>
                             <td className="px-4 py-3 font-bold text-gray-800 text-xs truncate max-w-[150px]">{h.personName || '---'}</td>
                             <td className="px-4 py-3 text-xs text-gray-600">
                                {warehouses?.find(w => String(w.id) === String(h.warehouseId))?.name || '---'}
                             </td>
                             <td className="px-4 py-3 font-bold font-mono">
                                <span className="text-emerald-600" dir="ltr">
                                   {formatNum(h.quantity)}
                                </span>
                             </td>
                             <td className="px-4 py-3 font-black text-indigo-700">{Number(h.unitPrice).toLocaleString()}</td>
                             <td className="px-4 py-3 font-black text-indigo-700">{(Number(h.unitPrice) * Number(h.quantity)).toLocaleString()}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                )}
              </motion.div>
            )}

            {activeTab === 'purchases' && (
              <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
                {loading ? (
                   <div className="text-center py-10 text-gray-400 font-bold animate-pulse">در حال استخراج سوابق ...</div>
                ) : history.filter(h => h.type === 'purchase').length === 0 ? (
                   <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-gray-100">فاکتور خریدی برای این کالا ثبت نشده است.</div>
                ) : (
                   <div className="overflow-x-auto border border-gray-100 rounded-xl shadow-sm">
                     <table className="w-full text-right text-sm">
                       <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                         <tr>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">تاریخ</th>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">شماره سند</th>
                           <th className="px-4 py-3 font-semibold text-xs">تامین‌کننده</th>
                           <th className="px-4 py-3 font-semibold text-xs">انبار</th>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">تعداد ({product.unit})</th>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">فی ({currency})</th>
                           <th className="px-4 py-3 font-semibold text-xs whitespace-nowrap">مبلغ کل ({currency})</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50 bg-white">
                         {history.filter(h => h.type === 'purchase').map((h, i) => (
                           <tr key={i} className="hover:bg-gray-50 transition-colors">
                             <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{h.date}</td>
                             <td className="px-4 py-3 text-gray-500 text-xs font-mono">{h.invoiceNumber || '---'}</td>
                             <td className="px-4 py-3 font-bold text-gray-800 text-xs truncate max-w-[150px]">{h.personName || '---'}</td>
                             <td className="px-4 py-3 text-xs text-gray-600">
                                {warehouses?.find(w => String(w.id) === String(h.warehouseId))?.name || '---'}
                             </td>
                             <td className="px-4 py-3 font-bold font-mono">
                                <span className="text-emerald-600" dir="ltr">
                                   {formatNum(h.quantity)}
                                </span>
                             </td>
                             <td className="px-4 py-3 font-black text-indigo-700">{Number(h.unitPrice).toLocaleString()}</td>
                             <td className="px-4 py-3 font-black text-indigo-700">{(Number(h.unitPrice) * Number(h.quantity)).toLocaleString()}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                )}
              </motion.div>
            )}"""
content = content.replace(target_table, replacement_table)

with open('src/components/modals/ProductCardModal.tsx', 'w') as f:
    f.write(content)
