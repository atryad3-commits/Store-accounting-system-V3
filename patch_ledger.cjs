const fs = require('fs');
let code = fs.readFileSync('src/components/persons/PersonLedger.tsx', 'utf-8');

const replacement1 = `                                    <p className="flex items-center">
                                      <span className="text-slate-500 w-24 inline-block font-bold print:w-20">
                                        تلفن تماس:
                                      </span>{" "}
                                      <span className="text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0 print:bg-transparent">
                                        {toPersianDigits(
                                          selectedPerson.phone
                                            ? selectedPerson.phone
                                            : "---",
                                        )}
                                      </span>
                                    </p>
                                    {selectedPerson.contacts && selectedPerson.contacts.length > 0 && selectedPerson.contacts.map((contact, idx) => (
                                      <p key={idx} className="flex items-center">
                                        <span className="text-slate-500 w-24 inline-block font-bold print:w-20 text-xs">
                                          {contact.type === 'mobile' ? 'موبایل' : contact.type === 'phone' ? 'تلفن ثابت' : contact.type === 'fax' ? 'فکس' : 'دیگر'}:
                                        </span>{" "}
                                        <span className="text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0 print:bg-transparent text-xs">
                                          {toPersianDigits(contact.number)} {contact.title ? \`(\${contact.title})\` : ''}
                                        </span>
                                      </p>
                                    ))}`;

code = code.replace(
  '<p className="flex items-center">\n                                      <span className="text-slate-500 w-24 inline-block font-bold print:w-20">\n                                        تلفن تماس:\n                                      </span>{" "}\n                                      <span className="text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0 print:bg-transparent">\n                                        {toPersianDigits(\n                                          selectedPerson.phone\n                                            ? selectedPerson.phone\n                                            : "---",\n                                        )}\n                                      </span>\n                                    </p>',
  replacement1
);

const replacement2 = `                                  {selectedPerson.phone && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-400 text-xs font-semibold">
                                        تلفن تماس:
                                      </span>
                                      <span
                                        className="font-mono text-gray-800 font-semibold"
                                        dir="ltr"
                                      >
                                        {selectedPerson.phone}
                                      </span>
                                    </div>
                                  )}
                                  {selectedPerson.contacts && selectedPerson.contacts.map((contact, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                      <span className="text-gray-400 text-xs font-semibold">
                                        {contact.type === 'mobile' ? 'موبایل' : contact.type === 'phone' ? 'تلفن ثابت' : contact.type === 'fax' ? 'فکس' : 'دیگر'}:
                                      </span>
                                      <span
                                        className="font-mono text-gray-800 font-semibold text-xs flex gap-1"
                                        dir="ltr"
                                      >
                                        {contact.title && <span className="text-[9px] text-gray-400">({contact.title})</span>}
                                        {contact.number}
                                      </span>
                                    </div>
                                  ))}`;

code = code.replace(
  '{selectedPerson.phone && (\n                                    <div className="flex items-center justify-between">\n                                      <span className="text-gray-400 text-xs font-semibold">\n                                        تلفن تماس:\n                                      </span>\n                                      <span\n                                        className="font-mono text-gray-800 font-semibold"\n                                        dir="ltr"\n                                      >\n                                        {selectedPerson.phone}\n                                      </span>\n                                    </div>\n                                  )}',
  replacement2
);

fs.writeFileSync('src/components/persons/PersonLedger.tsx', code);
console.log('Ledger patched');
