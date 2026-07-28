const fs = require('fs');
let content = fs.readFileSync('src/components/modals/PersonFormModal.tsx', 'utf8');

const oldMap = `{newPersonContacts.map((contact, idx) => (
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
                                      <option value="email">ایمیل</option>
                                      <option value="website">وبسایت</option>
                                      <option value="instagram">اینستاگرام</option>
                                      <option value="telegram">تلگرام</option>
                                      <option value="address">آدرس</option>
                                      <option value="postal_code">کد پستی</option>
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
                                      placeholder="مقدار"
                                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                                      dir={contact.type === 'address' || contact.type === 'other' ? "rtl" : "ltr"}
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
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    </button>
                                  </div>
                                ))}`;

const newMap = `{newPersonContacts.map((contact, idx) => (
                                  <div key={idx} className="flex flex-col gap-2 mb-3 p-3 border border-gray-100 rounded-xl bg-slate-50/50">
                                    <div className="flex items-center gap-2">
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
                                        <option value="email">ایمیل</option>
                                        <option value="website">وبسایت</option>
                                        <option value="instagram">اینستاگرام</option>
                                        <option value="telegram">تلگرام</option>
                                        <option value="address">آدرس</option>
                                        <option value="postal_code">کد پستی</option>
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
                                      {contact.type !== 'address' && (
                                        <input
                                          type="text"
                                          value={contact.number || ''}
                                          onChange={e => {
                                            const newContacts = [...newPersonContacts];
                                            newContacts[idx].number = e.target.value;
                                            setNewPersonContacts(newContacts);
                                          }}
                                          placeholder="مقدار"
                                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                                          dir={contact.type === 'other' ? "rtl" : "ltr"}
                                        />
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newContacts = [...newPersonContacts];
                                          newContacts.splice(idx, 1);
                                          setNewPersonContacts(newContacts);
                                        }}
                                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl mr-auto"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                      </button>
                                    </div>
                                    {contact.type === 'address' && (
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1 pl-10">
                                        <input
                                          type="text"
                                          value={contact.province || ''}
                                          onChange={e => {
                                            const newContacts = [...newPersonContacts];
                                            newContacts[idx].province = e.target.value;
                                            setNewPersonContacts(newContacts);
                                          }}
                                          placeholder="استان"
                                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <input
                                          type="text"
                                          value={contact.city || ''}
                                          onChange={e => {
                                            const newContacts = [...newPersonContacts];
                                            newContacts[idx].city = e.target.value;
                                            setNewPersonContacts(newContacts);
                                          }}
                                          placeholder="شهر"
                                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <input
                                          type="text"
                                          value={contact.postalCode || ''}
                                          onChange={e => {
                                            const newContacts = [...newPersonContacts];
                                            newContacts[idx].postalCode = e.target.value;
                                            setNewPersonContacts(newContacts);
                                          }}
                                          placeholder="کد پستی"
                                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <textarea
                                          value={contact.address || ''}
                                          onChange={e => {
                                            const newContacts = [...newPersonContacts];
                                            newContacts[idx].address = e.target.value;
                                            setNewPersonContacts(newContacts);
                                          }}
                                          placeholder="آدرس دقیق و کامل"
                                          rows={2}
                                          className="w-full md:col-span-3 px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500"
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}`;

content = content.replace(oldMap, newMap);
fs.writeFileSync('src/components/modals/PersonFormModal.tsx', content);
