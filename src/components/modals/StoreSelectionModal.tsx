import React, { useState } from 'react';
import { Database, Plus, Check, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function StoreSelectionModal({ availableStores, setAvailableStores, onSelectStore }: any) {
  const [newStoreName, setNewStoreName] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newStoreName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/databases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newStoreName })
      });
      const data = await res.json();
      if (data.success) {
        setAvailableStores([...availableStores, data.database]);
        onSelectStore(data.database.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900 flex items-center justify-center p-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">انتخاب کسب و کار</h2>
          <p className="text-slate-500">لطفا شرکت یا فروشگاه مورد نظر خود را انتخاب کنید</p>
        </div>

        <div className="space-y-3 mb-8 max-h-64 overflow-y-auto pr-2">
          {availableStores.map((store: any) => (
            <button
              key={store.id}
              onClick={() => { setLoading(store.id); onSelectStore(store.id); }}
              className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-right group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-600 group-hover:text-indigo-600 transition-colors">
                  <Database className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-700 group-hover:text-indigo-900">{store.name}</span>
              </div>
              {loading === store.id ? (
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              ) : (
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors transform -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
              )}
            </button>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-100">
          <label className="block text-sm font-bold text-slate-700 mb-2">ایجاد کسب و کار جدید</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newStoreName}
              onChange={e => setNewStoreName(e.target.value)}
              placeholder="نام فروشگاه / شرکت جدید..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
            />
            <button 
              onClick={handleCreate}
              disabled={creating || !newStoreName.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-2 transition-colors"
            >
              {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              ایجاد
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
