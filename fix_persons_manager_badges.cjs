const fs = require('fs');
let code = fs.readFileSync('src/components/persons/PersonsManager.tsx', 'utf8');

// Render categories in the UI inside PersonsManager
// Usually near: getRoleBadgeClasses
const searchStr = '{person.group && (';
if (code.includes(searchStr) && !code.includes('cat.name')) {
    const replacement = `{person.categories && person.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {person.categories.map((catId: string) => {
                                const cat = personCategories?.find((c: any) => c.id === catId);
                                if (!cat) return null;
                                return (
                                    <span key={cat.id} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                      {cat.icon && <span>{cat.icon}</span>}
                                      {cat.name}
                                    </span>
                                );
                            })}
                          </div>
                        )}
                        {person.group && (`;
                        
    code = code.replace('{person.group && (', replacement);
    fs.writeFileSync('src/components/persons/PersonsManager.tsx', code);
    console.log('Added categories badges to PersonsManager');
}

