import React, { useState, useEffect } from 'react';
import { Database, Plus, Check, Loader2, ArrowRight, Trash2, Edit2, X, Building2, Server } from 'lucide-react';
import { motion } from 'motion/react';

export default function BusinessManager({ availableStores, setAvailableStores, onSelectStore, onClose }: any) {
  const [newStoreName, setNewStoreName] = useState('');
  const [loading, setLoading] = useState<string | false>(false);
  const [creating, setCreating] = useState(false);
  
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

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
        setNewStoreName('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    setLoading(id);
    try {
      const res = await fetch(`/api/databases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName })
      });
      const data = await res.json();
      if (data.success) {
        setAvailableStores(availableStores.map((s: any) => s.id === id ? data.database : s));
        setEditingStoreId(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این کسب و کار اطمینان دارید؟ تمام داده‌های آن برای همیشه پاک خواهند شد و این عملیات غیرقابل بازگشت است.')) return;
    setLoading(id);
    try {
      const res = await fetch(`/api/databases/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setAvailableStores(availableStores.filter((s: any) => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-8" dir="rtl">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 max-w-3xl w-full relative z-10 border border-slate-100/50"
      >
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
        
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 border-b border-slate-100 pb-8">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 transform -rotate-45 translate-x-4"></div>
            <Building2 className="w-10 h-10 relative z-10" />
          </div>
          <div className="text-center sm:text-right">
            <h2 className="text-3xl font-black text-slate-900 mb-2">مدیریت کسب و کارها</h2>
            <p className="text-slate-500 text-lg">شرکت یا فروشگاه مورد نظر خود را انتخاب یا مدیریت کنید. هر کسب و کار دیتابیس ایزوله و اختصاصی خود را دارد.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          {availableStores.map((store: any) => (
            <div
              key={store.id}
              className={`w-full flex flex-col p-5 rounded-2xl border-2 transition-all bg-white relative group
                ${localStorage.getItem("activeStoreId") === store.id ? 'border-indigo-600 shadow-md shadow-indigo-600/10' : 'border-slate-100 hover:border-indigo-300'}`}
            >
              {localStorage.getItem("activeStoreId") === store.id && (
                <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  کسب و کار فعال
                </div>
              )}
              
              {editingStoreId === store.id ? (
                <div className="flex items-center gap-2 flex-1 mt-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                    autoFocus
                  />
                  <button onClick={() => handleUpdate(store.id)} disabled={loading === store.id} className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingStoreId(null)} className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm shrink-0
                      ${localStorage.getItem("activeStoreId") === store.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                      <Server className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className={`text-lg font-black truncate max-w-[200px] ${localStorage.getItem("activeStoreId") === store.id ? 'text-indigo-900' : 'text-slate-700 group-hover:text-indigo-900'}`}>
                        {store.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">DB: {store.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      {store.id !== 'default' && (
                        <>
                          <button 
                            onClick={() => { setEditingStoreId(store.id); setEditName(store.name); }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="ویرایش نام"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(store.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف کسب و کار"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => { setLoading(store.id); onSelectStore(store.id); }}
                      disabled={loading === store.id || localStorage.getItem("activeStoreId") === store.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all
                        ${localStorage.getItem("activeStoreId") === store.id 
                          ? 'bg-slate-100 text-slate-400 cursor-default'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                    >
                      {loading === store.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {localStorage.getItem("activeStoreId") === store.id ? 'در حال استفاده' : 'ورود'}
                          {localStorage.getItem("activeStoreId") !== store.id && <ArrowRight className="w-4 h-4" />}
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-600" />
            ایجاد کسب و کار جدید
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={newStoreName}
              onChange={e => setNewStoreName(e.target.value)}
              placeholder="نام فروشگاه یا شرکت جدید را وارد کنید..."
              className="flex-1 px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-lg font-medium"
            />
            <button 
              onClick={handleCreate}
              disabled={creating || !newStoreName.trim()}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
            >
              {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              ایجاد دیتابیس مستقل
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
