const fs = require('fs');
let code = fs.readFileSync('src/components/crm/DebtorsTracking.tsx', 'utf-8');

const lastPart = code.substring(code.indexOf('      {/* Note Modal */}'));
const newLastPart = `      {/* Note Modal */}
      <AnimatePresence>
        {isNoteModalOpen && selectedItem && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNoteModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="font-black text-gray-900 flex items-center gap-2">
                  <ListFilter className="w-5 h-5 text-indigo-500" /> سوابق پیگیری
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleRemoveItem(selectedItem.id)} className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors">حذف از لیست</button>
                  <button onClick={() => setIsNoteModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
              </div>
              
              <div className="p-5 overflow-y-auto flex-1 space-y-5">
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">
                       {persons.find((p: any) => String(p.id) === selectedItem.personId)?.name || 'نامشخص'}
                    </h4>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded mt-1 inline-block">
                      {columns.find(c => c.id === selectedItem.status)?.title || selectedItem.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-black text-gray-800 mb-3 flex items-center gap-2 border-b pb-2"><Calendar className="w-4 h-4 text-gray-400"/> تاریخچه یادداشت‌ها</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {(!selectedItem.notes || selectedItem.notes.length === 0) ? (
                      <p className="text-xs text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">هنوز یادداشتی ثبت نشده است</p>
                    ) : (
                      selectedItem.notes.map((note: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 relative">
                           <span className="absolute left-3 top-3 text-[9px] font-bold text-gray-400 font-sans">
                             {storeSettings?.calendarType === 'gregorian' ? new Date(note.date).toLocaleDateString('en-US') : new Date(note.date).toLocaleDateString('fa-IR')}
                           </span>
                           <p className="text-xs text-gray-700 leading-relaxed pl-16 whitespace-pre-wrap">{note.text}</p>
                        </div>
                      )).reverse()
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1.5">ثبت یادداشت جدید</label>
                    <textarea 
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                      placeholder="نتیجه تماس یا توافقات..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1.5">تاریخ اقدام بعدی (اختیاری)</label>
                    <DatePicker
                      value={newNextDate ? new Date(newNextDate) : null}
                      onChange={(date: any) => {
                          if (date) {
                              const d = new Date(date.toDate());
                              const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
                              setNewNextDate(localDate.toISOString().split('T')[0]);
                          } else {
                              setNewNextDate('');
                          }
                      }}
                      calendar={storeSettings?.calendarType === "gregorian" ? undefined : persian}
                      locale={storeSettings?.calendarType === "gregorian" ? undefined : persian_fa}
                      containerClassName="w-full"
                      inputClass="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none font-sans"
                    />
                  </div>
                  <button 
                    onClick={handleSaveNote}
                    disabled={!newNote && !newNextDate}
                    className="w-full py-2.5 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> ذخیره یادداشت
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
}`;

code = code.replace(lastPart, newLastPart);
fs.writeFileSync('src/components/crm/DebtorsTracking.tsx', code, 'utf-8');
console.log('Rewritten end of file');
