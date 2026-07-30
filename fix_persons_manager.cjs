const fs = require('fs');
let code = fs.readFileSync('src/components/persons/PersonsManager.tsx', 'utf8');

const target1 = `          return (
            <span className={\`text-[10px] font-black px-2 py-1 rounded-lg leading-none \${bg} \${text}\`}>
              {g.name}
            </span>
          );`;
const replacement1 = `          return (
            <span className={\`text-[10px] font-black px-2 py-1 rounded-lg leading-none \${bg} \${text} flex items-center gap-1\`}>
              {g.icon && <span>{g.icon}</span>}
              <span>{g.name}</span>
            </span>
          );`;

code = code.replace(target1, replacement1);

const target2 = `                                                  return (
                                                    <span className="text-[10px] font-bold text-slate-500">
                                                      {g.name}
                                                    </span>
                                                  );`;
const replacement2 = `                                                  return (
                                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                                      {g.icon && <span>{g.icon}</span>}
                                                      <span>{g.name}</span>
                                                    </span>
                                                  );`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/components/persons/PersonsManager.tsx', code);
console.log('Fixed PersonsManager');
