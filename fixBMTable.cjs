const fs = require('fs');
let bmCode = fs.readFileSync('src/components/admin/BusinessManager.tsx', 'utf8');

// The original grid starts at: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">`
// Ends at: `</div>` before `) : (`
// But we must rewrite the `filteredStores.map` block completely.

const newMap = `
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <th className="p-4 font-semibold">نام کسب و کار</th>
                      <th className="p-4 font-semibold text-center">شناسه (ID)</th>
                      <th className="p-4 font-semibold text-center">نوع دیتابیس</th>
                      <th className="p-4 font-semibold text-center">وضعیت</th>
                      <th className="p-4 font-semibold text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                {filteredStores.map((store: any) => {
                  const isActive = store.id === activeStoreId;
                  const isEditing = editingStoreId === store.id;
                  
                  return (
                    <tr 
                      key={store.id}
                      onClick={() => !isEditing && handleSelectStore(store.id, store.name)}
                      className={\`group transition-all cursor-pointer border-b last:border-b-0 border-slate-100 hover:bg-blue-50/50 \${isActive ? 'bg-blue-50/30' : ''}\`}
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className={\`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-colors \${isActive ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-100 text-slate-500 border-slate-200 group-hover:bg-white'}\`}>
                            <Database className="w-5 h-5" />
                          </div>
                          {isEditing ? (
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                              <input
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                className="w-full max-w-[200px] px-3 py-1.5 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-slate-800"
                                autoFocus
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleUpdate(e as any, store.id);
                                  if (e.key === 'Escape') setEditingStoreId(null);
                                }}
                              />
                            </div>
                          ) : (
                            <span className="font-bold text-slate-800 flex items-center gap-2">
                              {store.name}
                              {!isActive && store.id === 'default' && (
                                <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px] border border-amber-200 flex items-center gap-0.5"><Shield className="w-3 h-3"/> مرکزی</span>
                              )}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded border border-slate-200 inline-block">
                          {store.id === 'default' ? 'default' : store.id.substring(0,8)+'...'}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <span className="text-[11px] font-bold px-2 py-1 rounded bg-slate-50 text-slate-500 border border-slate-200 inline-block">
                          {store.db_type === 'postgres' ? 'PostgreSQL' : 'SQLite'}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-center">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-black border border-blue-200">
                            فعال
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium group-hover:text-blue-500 transition-colors">
                            {loading === store.id ? <Loader2 className="w-4 h-4 animate-spin inline-block" /> : 'ورود'}
                          </span>
                        )}
                      </td>
                      <td className="p-4 align-middle text-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isEditing ? (
                            <>
                              <button onClick={(e) => handleUpdate(e, store.id)} disabled={loading === store.id} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="ذخیره">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setEditingStoreId(null); }} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors" title="انصراف">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setEditingStoreId(store.id); setEditName(store.name); }}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="ویرایش نام"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => handleDelete(e, store.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                title="حذف کسب و کار"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                  </tbody>
                </table>
              </div>
`;

bmCode = bmCode.replace(/<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">[\s\S]*?(?=\s*\)\s*:\s*\(\s*<div className="h-full flex flex-col)/, newMap);

fs.writeFileSync('src/components/admin/BusinessManager.tsx', bmCode);
