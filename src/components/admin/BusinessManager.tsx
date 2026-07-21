import React, { useState, useMemo } from 'react';
import { Database, Plus, Check, Loader2, ArrowRight, Trash2, Edit2, X, Building2, Server, Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BusinessManager({ availableStores, setAvailableStores, onSelectStore, onClose }: any) {
  const [newStoreName, setNewStoreName] = useState('');
  const [loading, setLoading] = useState<string | false>(false);
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleSelectStore = async (id: string) => {
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

  const handleDelete = async (id: string) => {
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

  const handleUpdate = async (id: string) => {
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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex justify-center items-center p-4 z-50 rtl overflow-hidden" dir="rtl">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-slate-800/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-slate-800/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative z-10 border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 p-8 border-b border-slate-100 bg-white relative z-20">
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute top-8 left-8 p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 transform -rotate-45 translate-x-4"></div>
              <Building2 className="w-10 h-10 relative z-10" />
            </div>
            <div className="text-center sm:text-right flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">مدیریت کسب و کارها</h2>
              <p className="text-slate-500 text-lg">فروشگاه یا شرکت خود را انتخاب کنید. هر محیط دارای دیتابیس کاملا ایزوله است.</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 sm:p-8 flex flex-col custom-scrollbar">
          
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

          {/* Search Bar */}
          <div className="relative mb-6 shrink-0">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="جستجوی نام یا شناسه کسب و کار..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-900/10 focus:border-blue-700 outline-none transition-all text-slate-700 shadow-sm"
            />
          </div>

          {/* Stores Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-max pb-4">
            {filteredStores.map((store: any) => {
              const isActive = activeStoreId === store.id;
              const isPostgres = store.db_type === 'postgres';
              
              return (
                <div
                  key={store.id}
                  className={`flex flex-col p-5 rounded-xl border-2 transition-all bg-white relative group overflow-hidden
                    ${isActive ? 'border-blue-700 shadow-lg shadow-blue-900/10' : 'border-slate-200/60 hover:border-blue-300 hover:shadow-md'}`}
                >
                  {isActive && (
                    <div className="absolute top-0 right-0 left-0 h-1 bg-blue-500" />
                  )}
                  
                  {isActive && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-sm z-10 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      محیط فعال
                    </div>
                  )}
                  
                  {editingStoreId === store.id ? (
                    <div className="flex items-center gap-2 flex-1 mt-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="flex-1 px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none bg-blue-50/30 text-slate-900 font-bold"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleUpdate(store.id);
                          if (e.key === 'Escape') setEditingStoreId(null);
                        }}
                      />
                      <button onClick={() => handleUpdate(store.id)} disabled={loading === store.id} className="p-3 bg-blue-800 hover:bg-blue-900 text-white rounded-xl transition-colors shadow-sm">
                        <Check className="w-5 h-5" />
                      </button>
                      <button onClick={() => setEditingStoreId(null)} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-4 mb-5 mt-2">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors shadow-sm shrink-0 border
                          ${isActive ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-100'}`}>
                          <Database className="w-7 h-7" />
                        </div>
                        <div className="flex-1 text-right pt-1">
                          <h3 className={`text-xl font-black truncate ${isActive ? 'text-slate-900' : 'text-slate-800'}`}>
                            {store.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            {store.id === 'default' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-amber-50 text-amber-600 border-amber-200">
                                کسب و کار اصلی
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-emerald-50 text-emerald-600 border-emerald-200">
                                شعبه / شرکت فرعی
                              </span>
                            )}
                            <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[120px]" title={store.id}>
                              ID: {store.id === 'default' ? 'default' : store.id.substring(0,8)+'...'}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border $'bg-sky-50 text-sky-600 border-sky-100'`}>
                              'PostgreSQL'
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100/80">
                        <div className="flex items-center gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          {store.id !== 'default' && (
                            <>
                              <button 
                                onClick={() => { setEditingStoreId(store.id); setEditName(store.name); }}
                                className="p-2.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors focus:outline-none"
                                title="ویرایش نام"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(store.id)}
                                className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors focus:outline-none"
                                title="حذف کسب و کار"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => handleSelectStore(store.id)}
                          disabled={loading === store.id || isActive}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all
                            ${isActive 
                              ? 'bg-slate-100 text-slate-400 cursor-default'
                              : 'bg-blue-800 text-white hover:bg-blue-900 shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 active:scale-[0.98]'}`}
                        >
                          {loading === store.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              {isActive ? 'در حال استفاده' : 'ورود به سیستم'}
                              {!isActive && <ArrowRight className="w-4 h-4" />}
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            
            {filteredStores.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                 <Search className="w-12 h-12 mb-3 text-slate-300" />
                 <p className="text-lg font-medium">کسب و کاری یافت نشد</p>
                 <p className="text-sm mt-1">با این عبارت جستجو نتیجه‌ای نداشت.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer / Create Section */}
        <div className="flex-shrink-0 bg-white border-t border-slate-100 p-6 sm:px-8 sm:py-6 relative z-20">
          <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-500" />
            ایجاد کسب و کار جدید
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={newStoreName}
              onChange={e => setNewStoreName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreate();
              }}
              placeholder="نام فروشگاه، شرکت یا پروژه جدید..."
              className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-900/10 focus:border-blue-700 outline-none transition-all text-lg font-medium text-slate-800 placeholder:text-slate-400"
            />
            <button 
              onClick={handleCreate}
              disabled={creating || !newStoreName.trim()}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-100 disabled:text-emerald-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] min-w-[200px]"
            >
              {creating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
              {creating ? 'در حال ایجاد...' : 'ثبت و ایجاد'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
