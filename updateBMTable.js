const fs = require('fs');
let code = fs.readFileSync('src/components/admin/BusinessManager.tsx', 'utf8');

// Remove the back button if it exists
code = code.replace(/<button\\s+onClick=\\{onClose\\}[\\s\\S]*?<ArrowLeft className="w-5 h-5" \\/>[\\s\\S]*?<\\/button>/, '');

// Convert grid to table
code = code.replace(/<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">/, '<div className="overflow-x-auto"><table className="w-full text-right border-collapse"><thead><tr className="bg-slate-100 text-slate-600 border-b border-slate-200"><th className="p-4 font-semibold rounded-tr-xl">نام کسب و کار</th><th className="p-4 font-semibold">شناسه (ID)</th><th className="p-4 font-semibold">نوع دیتابیس</th><th className="p-4 font-semibold">وضعیت</th><th className="p-4 font-semibold rounded-tl-xl text-center">عملیات</th></tr></thead><tbody>');

code = code.replace(/<\\/div>\\s*\\)\\s*:\\s*\\(\\s*<div className="flex flex-col items-center justify-center py-20 text-slate-400">/m, '</tbody></table></div>\n            ) : (\n              <div className="flex flex-col items-center justify-center py-20 text-slate-400">');

// We have to rewrite the map function to return a <tr>
fs.writeFileSync('src/components/admin/BusinessManager.tsx', code);
