const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `{user.name?.charAt(0) || <User className="w-5 h-5" />}`;
const replacement1 = `{(() => {
                                        const p = user.personId ? persons?.find(x => String(x.id) === String(user.personId)) : null;
                                        const dName = p ? p.name : user.name;
                                        return dName?.charAt(0) || <User className="w-5 h-5" />;
                                      })()}`;

const target2 = `<div className="text-sm font-black text-slate-800 truncate">{user.name}</div>`;
const replacement2 = `<div className="text-sm font-black text-slate-800 truncate">
                                        {(() => {
                                           const p = user.personId ? persons?.find(x => String(x.id) === String(user.personId)) : null;
                                           return p ? p.name : user.name;
                                        })()}
                                      </div>`;

content = content.replace(target1, replacement1);
content = content.replace(target2, replacement2);

fs.writeFileSync(file, content);
