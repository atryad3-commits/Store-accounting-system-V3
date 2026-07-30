const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

const fetchIndex = code.indexOf('const roles = await getPersonRoles();');
if (fetchIndex > 0 && !code.includes('const categories = await getLocalData')) {
    code = code.replace(
        'const roles = await getPersonRoles();',
        'const roles = await getPersonRoles();\n      const categories = await getLocalData<any[]>("person_categories", []);'
    );
    code = code.replace(
        'setPersonRoles(roles as any[]);',
        'setPersonRoles(roles as any[]);\n      setPersonCategories(categories as any[]);'
    );
    fs.writeFileSync('src/hooks/useAppController.tsx', code);
    console.log('Injected fetch block');
}
