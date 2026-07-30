const fs = require('fs');
let code = fs.readFileSync('src/components/modals/PersonFormModal.tsx', 'utf8');

const roleUIMatch = `                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    نقش ارتباطی
                                  </label>
                                  <select
                                    value={newPersonRole}
                                    onChange={(e) =>
                                      setNewPersonRole(e.target.value)
                                    }
                                    disabled={!!editingPersonId}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 shadow-sm transition-colors text-slate-900 bg-white font-bold disabled:bg-slate-100 disabled:cursor-not-allowed"
                                  >
                                    {!newPersonRole && (
                                      <option value="">انتخاب نقش...</option>
                                    )}
                                    {(personRoles || []).map((r, index) => (
                                      <option key={r.id ? \`id-\${r.id}\` : \`idx-\${index}\`} value={r.id}>
                                        {r.name} (کد: {r.code})
                                      </option>
                                    ))}
                                  </select>`;

const roleUIReplace = `                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    نقش‌های ارتباطی (چندین نقش مجاز است)
                                  </label>
                                  <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white flex flex-wrap gap-3">
                                    {(personRoles || []).map((r, index) => {
                                      const isSelected = newPersonRoles.includes(r.id);
                                      return (
                                        <label key={r.id ? \`id-\${r.id}\` : \`idx-\${index}\`} className="flex items-center gap-2 cursor-pointer">
                                          <input 
                                            type="checkbox" 
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                            checked={isSelected}
                                            disabled={!!editingPersonId}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setNewPersonRoles([...newPersonRoles, r.id]);
                                                // Keep backward compatibility
                                                if (newPersonRoles.length === 0) setNewPersonRole(r.id);
                                              } else {
                                                setNewPersonRoles(newPersonRoles.filter(roleId => roleId !== r.id));
                                              }
                                            }}
                                          />
                                          <span className="text-sm font-bold text-slate-700">{r.name}</span>
                                        </label>
                                      );
                                    })}
                                  </div>`;

if (code.includes('نقش ارتباطی') && code.includes('disabled={!!editingPersonId}')) {
    code = code.replace(roleUIMatch, roleUIReplace);
    fs.writeFileSync('src/components/modals/PersonFormModal.tsx', code);
    console.log('Fixed role UI.');
} else {
    console.log('Role UI pattern not found.');
}
