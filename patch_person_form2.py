with open('src/components/modals/PersonFormModal.tsx', 'r') as f:
    content = f.read()

start_str = 'نام مستعار / تجاری'
start_idx = content.find(start_str)
if start_idx != -1:
    div_start = content.rfind('<div', 0, start_idx)
    div_end = content.find('</div>', start_idx) + 6
    
    old_str = content[div_start:div_end]
    
    new_str = """<div className="w-full text-right">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        نام مستعار / تجاری
                                      </label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          list="legalAliasOptionsList"
                                          value={newPersonAlias}
                                          onChange={(e) => setNewPersonAlias(e.target.value)}
                                          onFocus={(e) => {
                                            if (!newPersonAlias && newPersonCompanyName) {
                                              setNewPersonAlias(newPersonCompanyName);
                                            }
                                          }}
                                          placeholder={`مثال: ${newPersonCompanyName || "شرکت البرز"}`}
                                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900"
                                        />
                                        <datalist id="legalAliasOptionsList">
                                          {Array.from(new Set([
                                            newPersonCompanyName,
                                            `شرکت ${newPersonCompanyName}`,
                                            `فروشگاه ${newPersonCompanyName}`
                                          ].filter(Boolean))).map(opt => (
                                            <option key={opt} value={opt} />
                                          ))}
                                        </datalist>
                                      </div>
                                    </div>"""
    content = content.replace(old_str, new_str)
    with open('src/components/modals/PersonFormModal.tsx', 'w') as f:
        f.write(content)
    print("Replaced legal alias with datalist!")
else:
    print("Pattern not found")
