const fs = require('fs');
const content = fs.readFileSync('src/components/persons/PersonLedger.tsx', 'utf8');

const target = `                                  return (
                                    <table className="w-full text-right min-w-[950px] print:min-w-[0px] print:text-[12px] text-sm">
                                      <thead>
                                        <tr className="bg-slate-100/60 text-slate-500 border-b border-slate-200 font-bold text-xs uppercase tracking-wider print:text-[10px]">
                                          <th className="py-5 px-4 text-center w-10 print:w-8 print:px-2">
                                            ردیف
                                          </th>
                                          <th className="py-5 px-4 text-right w-36 print:w-28 print:px-2">
                                            تاریخ و ارجاع
                                          </th>
                                          <th className="py-5 px-6 text-right print:px-2">
                                            عنوان و شرح جزئیات رویداد مالی
                                          </th>
                                          <th className="py-5 px-4 text-left w-36 print:w-28 print:px-2">
                                            مبلغ (افزایش بدهی)
                                          </th>
                                          <th className="py-5 px-4 text-left w-36 print:w-28 print:px-2">
                                            پرداختی (کاهش بدهی)
                                          </th>
                                          <th className="py-5 px-6 text-left w-44 print:w-32 print:px-2">
                                            مانده نهایی حساب
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100 font-medium">`;

const replacement = `                                  return (
                                    <table className="w-full text-right min-w-[950px] print:min-w-[0px] print:text-[12px] text-sm border-collapse border-2 border-slate-700">
                                      <thead>
                                        <tr className="bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider print:text-[10px] border-b-2 border-slate-700">
                                          <th className="py-4 px-4 text-center w-10 print:w-8 print:px-2 border-2 border-slate-700">
                                            ردیف
                                          </th>
                                          <th className="py-4 px-4 text-right w-36 print:w-28 print:px-2 border-2 border-slate-700">
                                            تاریخ و ارجاع
                                          </th>
                                          <th className="py-4 px-6 text-right print:px-2 border-2 border-slate-700">
                                            عنوان و شرح جزئیات رویداد مالی
                                          </th>
                                          <th className="py-4 px-4 text-left w-36 print:w-28 print:px-2 border-2 border-slate-700 bg-rose-50/50">
                                            مبلغ (افزایش بدهی)
                                          </th>
                                          <th className="py-4 px-4 text-left w-36 print:w-28 print:px-2 border-2 border-slate-700 bg-emerald-50/50">
                                            پرداختی (کاهش بدهی)
                                          </th>
                                          <th className="py-4 px-6 text-left w-44 print:w-32 print:px-2 border-2 border-slate-700 bg-slate-100">
                                            مانده نهایی حساب
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="font-medium">`;

if (content.includes(target)) {
  fs.writeFileSync('src/components/persons/PersonLedger.tsx', content.replace(target, replacement));
  console.log('Patched thead successfully');
} else {
  console.log('Target for thead not found');
}
