const fs = require('fs');
let code = fs.readFileSync('src/components/modals/PersonFormModal.tsx', 'utf8');

// I will inject a multiselect UI for categories just above the roles selection, or below it.
const searchStr = '                </div>\n              </div>\n            )}'; // end of groups
// Let's just find where newPersonRoles is being handled.

const rolesSearch = '{/* Roles (Multiple) */}';
if (code.includes(rolesSearch) && !code.includes('برچسب‌ها و دسته‌بندی‌ها')) {
  const replacement = `
                {/* Categories (Multiple) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">برچسب‌ها و دسته‌بندی‌ها (اختیاری)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {personCategories?.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          if (newPersonCategories.includes(cat.id)) {
                            setNewPersonCategories(newPersonCategories.filter(id => id !== cat.id));
                          } else {
                            setNewPersonCategories([...newPersonCategories, cat.id]);
                          }
                        }}
                        className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all \${
                          newPersonCategories.includes(cat.id)
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }\`}
                      >
                        {cat.icon && <span>{cat.icon}</span>}
                        {cat.name}
                      </button>
                    ))}
                    {(!personCategories || personCategories.length === 0) && (
                      <span className="text-xs text-slate-400">برچسبی تعریف نشده است.</span>
                    )}
                  </div>
                </div>

                {/* Roles (Multiple) */}`;
  
  code = code.replace('{/* Roles (Multiple) */}', replacement);
  fs.writeFileSync('src/components/modals/PersonFormModal.tsx', code);
  console.log('Added categories selector to PersonFormModal');
}

