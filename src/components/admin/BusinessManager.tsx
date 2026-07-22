import React, { useState, useMemo } from 'react';
import { Database, Plus, Check, Loader2, Trash2, Edit2, X, Building2, Search, ArrowLeft, Shield, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BusinessManager({ availableStores, setAvailableStores, onSelectStore }: any) {
  const [newStoreName, setNewStoreName] = useState('');
  const [loading, setLoading] = useState<string | false>(false);
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleSelectStore = async (id: string, name: string) => {
    if (!window.confirm(`آیا از ورود به کسب و کار «${name}» اطمینان دارید؟`)) return;
    
    setLoading(id);
    setErrorMsg(null);
    try {
        const res = await fetch(`/api/databases/${id}/test-connection`);
        const data = await res.json();
        if (data.success) {
            onSelectStore(id);
        } else {
            setErrorMsg(data.error || 'خطا در ارتباط با دیتابیس کسب و کار');
            setLoading(false);
        }
    } catch(e: any) {
        setErrorMsg('خطا در ارتباط با سرور');
        setLoading(false);
    }
  };

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
      } else {
        setErrorMsg(data.error || 'خطا در ایجاد کسب و کار');
      }
    } catch (e) {
      setErrorMsg('خطا در ارتباط با سرور');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('آیا از حذف این کسب و کار اطمینان دارید؟ تمام اطلاعات آن از بین خواهد رفت.')) return;
    try {
      const res = await fetch(`/api/databases/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAvailableStores(availableStores.filter((s: any) => s.id !== id));
      }
    } catch (e) {
      setErrorMsg('خطا در حذف کسب و کار');
    }
  };

  const handleUpdate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!editName.trim()) return;
    try {
      const res = await fetch(`/api/databases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName })
      });
      const data = await res.json();
      if (data.success) {
        setAvailableStores(availableStores.map((s: any) => s.id === id ? { ...s, name: editName } : s));
        setEditingStoreId(null);
      }
    } catch (e) {
       setErrorMsg('خطا در بروزرسانی نام کسب و کار');
    }
  };

  const filteredStores = useMemo(() => {
    return availableStores.filter((store: any) => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableStores, searchTerm]);

  const activeStoreId = localStorage.getItem("activeStoreId");

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col pt-8 pb-12 px-4 sm:px-8 rtl" dir="rtl">
      
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">پرتال کسب و کارها</h1>
              <p className="text-slate-500 mt-1.5 font-medium text-lg">انتخاب، ایجاد و مدیریت یکپارچه محیط‌های کاری</p>
            </div>
          </div>
          
          <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-2 lg:w-[400px]">
            <input 
              type="text" 
              value={newStoreName}
              onChange={e => setNewStoreName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreate();
              }}
              placeholder="نام کسب و کار جدید..." 
              className="flex-1 bg-transparent px-3 outline-none text-slate-800 font-bold placeholder:font-normal placeholder:text-slate-400"
            />
            <button 
              onClick={handleCreate}
              disabled={creating || !newStoreName.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/20"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              ایجاد
            </button>
          </div>
        </div>

        <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 flex items-center gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                    <X className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-rose-800">خطا در عملیات</p>
                    <p className="text-sm opacity-90">{errorMsg}</p>
                  </div>
                  <button onClick={() => setErrorMsg(null)} className="p-2 hover:bg-rose-100 rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        {/* Content Table / List */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
          
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              لیست دیتابیس‌ها و کسب و کارها
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold mr-2">{availableStores.length}</span>
            </h2>
            
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="جستجو..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-slate-50/30">
            {filteredStores.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredStores.map((store: any) => {
                  const isActive = store.id === activeStoreId;
                  const isEditing = editingStoreId === store.id;
                  
                  return (
                    <motion.div 
                      key={store.id}
                      layoutId={`store-${store.id}`}
                      onClick={() => !isEditing && handleSelectStore(store.id, store.name)}
                      className={`group relative flex flex-col p-6 rounded-2xl border transition-all cursor-pointer overflow-hidden
                        ${isActive 
                          ? 'bg-blue-50/50 border-blue-200 shadow-md shadow-blue-500/5' 
                          : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5'}`}
                    >
                      {/* Status indicator */}
                      <div className={`absolute top-0 right-0 w-full h-1.5 transition-colors ${isActive ? 'bg-blue-500' : 'bg-transparent group-hover:bg-blue-200'}`} />
                      
                      <div className="flex items-start justify-between mb-4 mt-2">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-sm transition-colors
                          ${isActive ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200'}`}>
                          <Database className="w-6 h-6" />
                        </div>
                        
                        {isActive && (
                          <span className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black border border-blue-200">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            فعال
                          </span>
                        )}
                        {!isActive && store.id === 'default' && (
                          <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-[10px] font-bold border border-amber-200">
                            <Shield className="w-3 h-3" />
                            مرکزی
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        {isEditing ? (
                          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="flex-1 w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-black text-slate-800"
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleUpdate(e as any, store.id);
                                if (e.key === 'Escape') setEditingStoreId(null);
                              }}
                            />
                          </div>
                        ) : (
                          <h3 className="text-xl font-black text-slate-800 line-clamp-1 mb-1" title={store.name}>
                            {store.name}
                          </h3>
                        )}
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200 truncate" title={store.id}>
                            ID: {store.id === 'default' ? 'default' : store.id.substring(0,8)+'...'}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200">
                            {store.db_type === 'postgres' ? 'PostgreSQL' : 'SQLite'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isEditing ? (
                            <>
                              <button onClick={(e) => handleUpdate(e, store.id)} disabled={loading === store.id} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setEditingStoreId(null); }} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setEditingStoreId(store.id); setEditName(store.name); }}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="ویرایش نام"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => handleDelete(e, store.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="حذف کسب و کار"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>

                        <div className={`text-sm font-bold flex items-center gap-1.5 transition-colors
                          ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`}>
                          {loading === store.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              {!isActive && 'ورود'}
                              <ArrowLeft className={`w-4 h-4 ${isActive ? 'hidden' : ''}`} />
                            </>
                          )}
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                 <Search className="w-16 h-16 mb-4 text-slate-300" />
                 <p className="text-xl font-medium text-slate-600">کسب و کاری یافت نشد</p>
                 <p className="text-base mt-2">با این عبارت جستجو نتیجه‌ای نداشت.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
