with open('src/components/modals/ProductFormModal.tsx', 'r') as f:
    content = f.read()

old_input_1 = """                                <input
                                  type="date"
                                  value={newProductPriceDate}
                                  onChange={(e) => setNewProductPriceDate(e.target.value)}
                                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors text-emerald-900 font-mono text-left bg-white"
                                />"""

new_input_1 = """                                <DatePicker
                                  value={newProductPriceDate}
                                  onChange={(date: any) => setNewProductPriceDate(date ? (typeof date.toDate === 'function' ? date.toDate().toISOString() : new Date(date).toISOString()) : new Date().toISOString())}
                                  calendar={storeSettings?.calendarType === "gregorian" ? undefined : persian}
                                  locale={storeSettings?.calendarType === "gregorian" ? undefined : persian_fa}
                                  calendarPosition="bottom-right"
                                  inputClass="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors text-emerald-900 font-mono text-left bg-white"
                                />"""

content = content.replace(old_input_1, new_input_1)

old_input_2 = """                                                  <input
                                                    type="date"
                                                    value={editingHistoryDate.split('T')[0]}
                                                    onChange={(e) => setEditingHistoryDate(e.target.value)}
                                                    className="w-full px-2 py-1 rounded border border-gray-300 text-sm"
                                                  />"""

new_input_2 = """                                                  <DatePicker
                                                    value={editingHistoryDate}
                                                    onChange={(date: any) => setEditingHistoryDate(date ? (typeof date.toDate === 'function' ? date.toDate().toISOString() : new Date(date).toISOString()) : new Date().toISOString())}
                                                    calendar={storeSettings?.calendarType === "gregorian" ? undefined : persian}
                                                    locale={storeSettings?.calendarType === "gregorian" ? undefined : persian_fa}
                                                    calendarPosition="bottom-right"
                                                    inputClass="w-full px-2 py-1 rounded border border-gray-300 text-sm"
                                                  />"""

content = content.replace(old_input_2, new_input_2)

with open('src/components/modals/ProductFormModal.tsx', 'w') as f:
    f.write(content)
