const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'const [newPersonPhone, setNewPersonPhone] = useState("");',
  'const [newPersonPhone, setNewPersonPhone] = useState("");\n  const [newPersonContacts, setNewPersonContacts] = useState<any[]>([]);'
);

code = code.replace(
  'setNewPersonPhone("");',
  'setNewPersonPhone("");\n      setNewPersonContacts([]);'
);

code = code.replace(
  'setNewPersonPhone(p.phone || "");',
  'setNewPersonPhone(p.phone || "");\n    setNewPersonContacts(p.contacts || []);'
);

// We need to find the payload when saving a person.
// The payload has `phone: newPersonPhone,`
// Let's replace it with `phone: newPersonPhone, contacts: newPersonContacts,`

code = code.replace(
  'phone: newPersonPhone,',
  'phone: newPersonPhone,\n        contacts: newPersonContacts,'
);

// We also need to find the place in the UI where `newPersonPhone` is rendered and add the UI for `newPersonContacts`.
const uiToInject = `
                              <div className="w-full text-right md:col-span-2 mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  سایر شماره‌های تماس
                                </label>
                                {newPersonContacts.map((contact, idx) => (
                                  <div key={idx} className="flex items-center gap-2 mb-2">
                                    <select
                                      value={contact.type}
                                      onChange={e => {
                                        const newContacts = [...newPersonContacts];
                                        newContacts[idx].type = e.target.value;
                                        setNewPersonContacts(newContacts);
                                      }}
                                      className="px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white"
                                    >
                                      <option value="mobile">موبایل</option>
                                      <option value="phone">تلفن ثابت</option>
                                      <option value="fax">فکس</option>
                                      <option value="other">دیگر</option>
                                    </select>
                                    <input
                                      type="text"
                                      value={contact.title || ''}
                                      onChange={e => {
                                        const newContacts = [...newPersonContacts];
                                        newContacts[idx].title = e.target.value;
                                        setNewPersonContacts(newContacts);
                                      }}
                                      placeholder="عنوان (اختیاری)"
                                      className="w-1/3 px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <input
                                      type="text"
                                      value={contact.number}
                                      onChange={e => {
                                        const newContacts = [...newPersonContacts];
                                        newContacts[idx].number = e.target.value;
                                        setNewPersonContacts(newContacts);
                                      }}
                                      placeholder="شماره"
                                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 font-mono"
                                      dir="ltr"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newContacts = [...newPersonContacts];
                                        newContacts.splice(idx, 1);
                                        setNewPersonContacts(newContacts);
                                      }}
                                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => setNewPersonContacts([...newPersonContacts, { type: 'mobile', number: '', title: '' }])}
                                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                  افزودن شماره تماس جدید
                                </button>
                              </div>
`;

code = code.replace(
  'dir="ltr"\n                                />\n                              </div>\n                            </>',
  'dir="ltr"\n                                />\n                              </div>\n' + uiToInject + '                            </>'
);

fs.writeFileSync('src/App.tsx', code);
console.log('App patched');
