const fs = require('fs');
let code = fs.readFileSync('src/components/crm/DebtorsTracking.tsx', 'utf-8');

const settingsIcon = `import { Plus, X, Search, Phone, User, Calendar, Save, ListFilter, UserPlus, Users, Settings } from 'lucide-react';`;
code = code.replace(/import \{ Plus, X, Search, Phone, User, Calendar, Save, ListFilter, UserPlus, Users \} from 'lucide-react';/g, settingsIcon);

// In the header, add Settings button
const oldHeader = `<div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="جستجوی شخص..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-4 pr-9 py-2 border border-gray-200 rounded-xl text-sm w-64 bg-gray-50 focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            افزودن شخص به بورد
          </button>
        </div>`;
const newHeader = `<div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="جستجوی شخص..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-4 pr-9 py-2 border border-gray-200 rounded-xl text-sm w-64 bg-gray-50 focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>
          <button 
            onClick={() => setIsColumnsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            افزودن شخص به بورد
          </button>
        </div>`;
if (code.includes(oldHeader)) {
    code = code.replace(oldHeader, newHeader);
} else {
    console.log("Could not find header");
}

const oldDndStart = `{COLUMNS.map(column => {`;
const newDndStart = `{columns.map(column => {`;
code = code.replace(oldDndStart, newDndStart);
code = code.replace(/COLUMNS/g, 'columns'); // Replaces other usages of COLUMNS

// Replace column title display in notes
const oldColumnTitleNote = `{columns.find(c => c.id === selectedItem.status)?.title}`;
const newColumnTitleNote = `{columns.find(c => c.id === selectedItem.status)?.title || selectedItem.status}`;
code = code.replace(oldColumnTitleNote, newColumnTitleNote);

// Add the columns Modal
const columnsModal = `      <AnimatePresence>
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

const endOfFile = `    </div>\n  );\n}`;
code = code.replace(endOfFile, columnsModal + '\n' + endOfFile);

// Import Trash2
if (!code.includes('Trash2')) {
   code = code.replace(/import \{ Plus/g, `import { Trash2, Plus`);
}

fs.writeFileSync('src/components/crm/DebtorsTracking.tsx', code, 'utf-8');
console.log('Patched UI for columns');
