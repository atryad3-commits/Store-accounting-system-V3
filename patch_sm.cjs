const fs = require('fs');
let code = fs.readFileSync('src/components/inventory/StocktakingManager.tsx', 'utf-8');

const countedProductsLogic = `
                 <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 gap-6">
                    <div className="flex flex-col md:flex-row gap-6 w-full lg:w-auto flex-1">
                      <div className="flex gap-6">
                        <div className="text-sm">
                          <span className="text-slate-500 block mb-1">اقلام شمرده شده</span>
                          <span className="font-bold text-slate-800">
                            {toPersianDigits((items || []).filter(i => i.countedStock !== null).length)} از {toPersianDigits((products || []).filter(p => p.type === 'product' || !p.type).length)} کل کالاها
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-slate-500 block mb-1">دارای مغایرت</span>
                          <span className="font-bold text-rose-600">
                            {toPersianDigits((items || []).filter(i => i.countedStock !== null && i.difference !== 0).length)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 w-full max-w-sm self-center">
                        <div className="flex justify-between text-xs mb-2">
                          <span className="font-bold text-slate-600">پیشرفت کل انبارگردانی</span>
                          <span className="font-bold text-indigo-600">
                            {toPersianDigits(
                              (products || []).filter(p => p.type === 'product' || !p.type).length > 0 
                              ? Math.min(100, Math.round(((items || []).filter(i => i.countedStock !== null).length / (products || []).filter(p => p.type === 'product' || !p.type).length) * 100))
                              : 0
                            )}٪
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                            style={{ 
                              width: \`\${(products || []).filter(p => p.type === 'product' || !p.type).length > 0 ? Math.min(100, Math.round(((items || []).filter(i => i.countedStock !== null).length / (products || []).filter(p => p.type === 'product' || !p.type).length) * 100)) : 0}%\`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 w-full lg:w-auto justify-end">
`;

code = code.replace(/<div className="mt-8 flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">[\s\S]*?<div className="flex gap-4">/, countedProductsLogic);

fs.writeFileSync('src/components/inventory/StocktakingManager.tsx', code, 'utf-8');
console.log('patched sm');
