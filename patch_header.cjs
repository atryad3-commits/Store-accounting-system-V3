const fs = require('fs');
let code = fs.readFileSync('src/components/crm/DebtorsTracking.tsx', 'utf-8');

const oldHeader = `<button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          افزودن شخص به لیست
        </button>`;

const newHeader = `<div className="flex gap-2">
          <button
            onClick={() => setIsColumnsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-bold shadow-sm transition-colors"
            title="مدیریت وضعیت‌ها"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            افزودن شخص به لیست
          </button>
        </div>`;

code = code.replace(oldHeader, newHeader);

// add settings to lucide icons imports
code = code.replace(/import \{ Trash2, Plus, X, Search, Phone, User, Calendar, Save, ListFilter, UserPlus, Users \} from 'lucide-react';/g, "import { Trash2, Plus, X, Search, Phone, User, Calendar, Save, ListFilter, UserPlus, Users, Settings } from 'lucide-react';");
code = code.replace(/import \{ Plus, X, Search, Phone, User, Calendar, Save, ListFilter, UserPlus, Users \} from 'lucide-react';/g, "import { Trash2, Plus, X, Search, Phone, User, Calendar, Save, ListFilter, UserPlus, Users, Settings } from 'lucide-react';");


fs.writeFileSync('src/components/crm/DebtorsTracking.tsx', code, 'utf-8');
console.log('Patched header');
