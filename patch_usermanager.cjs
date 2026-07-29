const fs = require('fs');
const file = 'src/components/admin/UserManager.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('getPersons')) {
  content = content.replace(
    /import { getUsers, addUser, updateUser, deleteUser } from '\.\.\/\.\.\/services\/dataService';/,
    "import { getUsers, addUser, updateUser, deleteUser, getPersons } from '../../services/dataService';"
  );
}

if (!content.includes('const [persons, setPersons]')) {
  content = content.replace(
    /const \[users, setUsers\] = useState<User\[\]>\(\[\]\);/,
    "const [users, setUsers] = useState<User[]>([]);\n  const [persons, setPersons] = useState<any[]>([]);"
  );
}

if (!content.includes('setPersons(pData)')) {
  content = content.replace(
    /const data = await getUsers\(\);\n    setUsers\(data\);/,
    "const data = await getUsers();\n    setUsers(data);\n    const pData = await getPersons();\n    setPersons(pData);"
  );
}

content = content.replace(
  /<th className="px-6 py-4">وضعیت<\/th>/,
  '<th className="px-6 py-4">وضعیت</th>\n                 <th className="px-6 py-4">پروفایل شخص</th>'
);

content = content.replace(
  /<td className="px-6 py-4 flex flex-col gap-2">([\s\S]*?)<\/td>/,
  `<td className="px-6 py-4 flex flex-col gap-2">$1</td>
                    <td className="px-6 py-4">
                       {(() => {
                         if (!u.personId) return <span className="text-gray-400 text-xs">متصل نیست</span>;
                         const p = persons.find(x => String(x.id) === String(u.personId));
                         return p ? <span className="text-indigo-600 font-bold text-xs">{p.name}</span> : <span className="text-gray-400 text-xs">یافت نشد</span>;
                       })()}
                    </td>`
);

fs.writeFileSync(file, content);
