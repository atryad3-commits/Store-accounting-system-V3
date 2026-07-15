const fs = require('fs');
let code = fs.readFileSync('src/components/inventory/FastStocktakingMobile.tsx', 'utf-8');

const headerHtml = `        <div className="flex-1 w-full">
          <div className="flex justify-between items-center w-full mb-1">
            <h1 className="font-black text-gray-800 text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              در حال شمارش
            </h1>
            <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded-lg">
              کد: {session.id}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1.5 w-full">
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
               <div 
                 className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                 style={{ width: \`\${products.length > 0 ? Math.min(100, Math.round(((session.items?.filter((i: any) => i.countedStock !== null).length || 0) / products.length) * 100)) : 0}%\` }}
               ></div>
            </div>
            <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap">
               {session.items?.filter((i: any) => i.countedStock !== null).length || 0} از {products.length}
            </span>
          </div>
        </div>`;

code = code.replace(/<div>\s*<h1 className="font-black text-gray-800 text-lg flex items-center gap-2">\s*<CheckCircle className="w-5 h-5 text-emerald-500" \/>\s*در حال شمارش\s*<\/h1>\s*<p className="text-xs text-gray-500 font-mono">\s*کد: \{session\.id\} \| تعداد کل اقلام: \{session\.items\?\.filter\(i => i\.countedStock !== null\)\.length \|\| 0\}\s*<\/p>\s*<\/div>/, headerHtml);

fs.writeFileSync('src/components/inventory/FastStocktakingMobile.tsx', code, 'utf-8');
console.log('patched fsm');
