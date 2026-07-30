const fs = require('fs');
let code = fs.readFileSync('src/components/common/SyncStatusModal.tsx', 'utf8');

const oldCode = `                  {task.status === 'ERROR' && (
                    <div className="flex items-center gap-2 justify-end mt-1 border-t border-slate-50 pt-2">
                      <button onClick={() => handleRemove(task.id)} className="text-xs text-slate-500 hover:text-rose-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">
                        حذف از صف
                      </button>
                      <button onClick={() => handleRetry(task.id)} className="text-xs text-indigo-600 hover:bg-indigo-50 bg-indigo-50/50 border border-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5" />
                        تلاش مجدد
                      </button>
                    </div>
                  )}`;

const newCode = `                  {(task.status === 'ERROR' || task.status === 'PENDING') && (
                    <div className="flex items-center gap-2 justify-end mt-1 border-t border-slate-50 pt-2">
                      <button onClick={() => handleRemove(task.id)} className="text-xs text-slate-500 hover:text-rose-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">
                        حذف از صف
                      </button>
                      {task.status === 'ERROR' && (
                        <button onClick={() => handleRetry(task.id)} className="text-xs text-indigo-600 hover:bg-indigo-50 bg-indigo-50/50 border border-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                          <RefreshCw className="w-3.5 h-3.5" />
                          تلاش مجدد
                        </button>
                      )}
                    </div>
                  )}`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/components/common/SyncStatusModal.tsx', code);
console.log('patched SyncStatusModal');
