const fs = require('fs');
const file = 'src/components/accounts/CashboxesManager.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'موجودی فعلی (تومان)',
  'موجودی فعلی ({storeSettings?.currency || "تومان"})'
);

const headerToFind = `<th className="py-4 px-6 font-semibold">
                                مسئول صندوق
                              </th>`;
const headerToReplace = `<th className="py-4 px-6 font-semibold">
                                مسئول صندوق
                              </th>
                              <th className="py-4 px-6 font-semibold">
                                شماره حساب
                              </th>`;
content = content.replace(headerToFind, headerToReplace);

const bodyToFind = `<td className="py-4 px-6 text-sm">
                                  {box.manager || "نامشخص"}
                                </td>`;
const bodyToReplace = `<td className="py-4 px-6 text-sm">
                                  {box.manager || "نامشخص"}
                                </td>
                                <td className="py-4 px-6 text-sm font-mono text-left" dir="ltr">
                                  {box.accountNumber || "-"}
                                </td>`;
content = content.replace(bodyToFind, bodyToReplace);

fs.writeFileSync(file, content);
