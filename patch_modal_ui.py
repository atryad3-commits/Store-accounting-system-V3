import sys

with open('src/components/modals/PricingWizardModal.tsx', 'r') as f:
    content = f.read()

target_headers = """                      <th className="p-4 font-extrabold text-slate-700 w-32 border-r border-slate-100 text-center">
                        قیمت خرید ({storeSettings.currency})
                      </th>
                      <th className="p-4 font-extrabold text-slate-700 w-32 border-r border-slate-100 text-center">
                        حاشیه سود (٪)
                      </th>
                      <th className="p-4 font-extrabold text-slate-700 w-44 border-r border-slate-100 text-center">
                        قیمت فروش ({storeSettings.currency})
                      </th>"""

replacement_headers = """                      <th className="p-4 font-extrabold text-slate-700 w-32 border-r border-slate-100 text-center text-xs">
                        قیمت خرید واحد اصلی<br/><span className="text-[10px] text-slate-400 font-normal">({storeSettings.currency})</span>
                      </th>
                      <th className="p-4 font-extrabold text-slate-700 w-32 border-r border-slate-100 text-center">
                        حاشیه سود (٪)
                      </th>
                      <th className="p-4 font-extrabold text-slate-700 w-44 border-r border-slate-100 text-center text-xs">
                        قیمت فروش واحد اصلی<br/><span className="text-[10px] text-slate-400 font-normal">({storeSettings.currency})</span>
                      </th>"""

if target_headers in content:
    content = content.replace(target_headers, replacement_headers)
    print("Headers replaced!")

target_row = """                        <td className="p-4 font-bold text-slate-800">
                          {item.productName}
                        </td>"""

replacement_row = """                        <td className="p-4 font-bold text-slate-800 flex flex-col gap-1">
                          <span>{item.productName}</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            واحد اصلی: {products.find((p: any) => p.id === item.productId)?.unit || '---'}
                          </span>
                        </td>"""

if target_row in content:
    content = content.replace(target_row, replacement_row)
    print("Row replaced!")

with open('src/components/modals/PricingWizardModal.tsx', 'w') as f:
    f.write(content)
