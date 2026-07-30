const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

code = code.replace(
  'getPersonRoles,',
  'getPersonRoles,\n  getPersonCategories,'
);

code = code.replace(
  'const roles = await getPersonRoles();',
  'const roles = await getPersonRoles();\n      const categories = await getPersonCategories();'
);

code = code.replace(
  'setPersonRoles(roles as any[]);',
  'setPersonRoles(roles as any[]);\n      setPersonCategories(categories as any[]);'
);

fs.writeFileSync('src/hooks/useAppController.tsx', code);
console.log('Fixed imports and fetch');
