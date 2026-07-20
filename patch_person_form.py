with open('src/components/modals/PersonFormModal.tsx', 'r') as f:
    content = f.read()

start_str = '-- انتخاب ترکیب نام مستعار --'
start_idx = content.find(start_str)
if start_idx != -1:
    div_start = content.rfind('<div', 0, start_idx)
    div_start = content.rfind('<div', 0, div_start) # get the outer div
    div_end = content.find('</div>', start_idx)
    div_end = content.find('</div>', div_end + 6)
    div_end = content.find('</div>', div_end + 6) + 6
    
    old_str = content[div_start:div_end]
    
    new_str = """<div className="w-full text-right">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        نام مستعار / نمایشی
                                      </label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          list="aliasOptionsList"
                                          value={newPersonAlias}
                                          onChange={(e) => setNewPersonAlias(e.target.value)}
                                          onFocus={(e) => {
                                            if (!newPersonAlias) {
                                              const defaultAlias = `${newPersonTitle} ${newPersonFirstName} ${newPersonLastName}`.trim().replace(/\\s+/g, ' ');
                                              if (defaultAlias) setNewPersonAlias(defaultAlias);
                                            }
                                          }}
                                          placeholder="انتخاب از لیست یا تایپ دستی..."
                                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900"
                                        />
                                        <datalist id="aliasOptionsList">
                                          {Array.from(new Set([
                                            `${newPersonTitle} ${newPersonFirstName} ${newPersonLastName}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonFirstName} ${newPersonLastName}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonTitle} ${newPersonLastName}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonLastName}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonFirstName} ${newPersonFatherName ? `(فرزند ${newPersonFatherName})` : ''} ${newPersonLastName}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonTitle} ${newPersonFirstName}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonFirstName}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonLastName} ${newPersonFirstName}`.trim().replace(/\\s+/g, ' ')
                                          ].filter(Boolean))).map(opt => (
                                            <option key={opt} value={opt} />
                                          ))}
                                        </datalist>
                                      </div>
                                    </div>"""
    content = content.replace(old_str, new_str)
    with open('src/components/modals/PersonFormModal.tsx', 'w') as f:
        f.write(content)
    print("Replaced with datalist!")
else:
    print("Pattern not found")
