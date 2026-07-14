const fs = require('fs');
let code = fs.readFileSync('src/components/persons/PersonProfileView.tsx', 'utf-8');

const replacement = `            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
              <span dir="ltr">{toPersianDigits(person.phone || "---")}</span>
            </div>
            {person.contacts && person.contacts.length > 0 && person.contacts.map((contact: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span dir="ltr">{toPersianDigits(contact.number)}</span>
                {contact.title && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{contact.title}</span>}
                <span className="text-[10px] text-gray-400">({contact.type === 'mobile' ? 'موبایل' : contact.type === 'phone' ? 'تلفن ثابت' : contact.type === 'fax' ? 'فکس' : 'دیگر'})</span>
              </div>
            ))}`;

code = code.replace(
  '<div className="flex items-center gap-3">\n              <Phone className="w-4 h-4 text-indigo-500 shrink-0" />\n              <span dir="ltr">{toPersianDigits(person.phone || "---")}</span>\n            </div>',
  replacement
);

fs.writeFileSync('src/components/persons/PersonProfileView.tsx', code);
console.log('Profile patched');
