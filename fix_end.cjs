const fs = require('fs');
let code = fs.readFileSync('src/components/crm/DebtorsTracking.tsx', 'utf-8');

const wrongModal = `      <AnimatePresence>
        {isColumnsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsColumnsModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="font-black text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-500" /> مدیریت وضعیت‌های پیگیری
                </h3>
                <button onClick={() => setIsColumnsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-5 space-y-4">
                <div className="flex gap-2">
                   <input 
                      type="text" 
                      value={newColumnTitle}
                      onChange={e => setNewColumnTitle(e.target.value)}
                      placeholder="عنوان وضعیت جدید..."
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                   />
                   <button 
                      onClick={handleAddColumn}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
                   >
                      افزودن وضعیت
                   </button>
                </div>
                
                <div className="space-y-2 mt-4 max-h-64 overflow-y-auto">
                   {columns.map(c => (
                     <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                        <span className="text-sm font-bold text-gray-800">{c.title}</span>
                        <button onClick={() => handleDeleteColumn(c.id)} className="text-rose-500 hover:text-rose-700 p-1">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>`;

code = code.replace(wrongModal + '\n        )}\n      </AnimatePresence>\n    </div>\n  );\n}', '\n    </div>\n  );\n}');
code = code.replace(`        )}
      </AnimatePresence>
    </div>
  );
}`, `        )}
      </AnimatePresence>
${wrongModal}
    </div>
  );
}`);

fs.writeFileSync('src/components/crm/DebtorsTracking.tsx', code, 'utf-8');
console.log('Fixed JSX structure');
