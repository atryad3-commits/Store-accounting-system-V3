const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

if (!code.includes('personCategories')) {
  // Add state
  code = code.replace(
    'const [personRoles, setPersonRoles] = useState<any[]>([]);',
    'const [personRoles, setPersonRoles] = useState<any[]>([]);\n  const [personCategories, setPersonCategories] = useState<any[]>([]);'
  );

  // Add to fetchPersons
  code = code.replace(
    'const roles = await getPersonRoles();',
    'const roles = await getPersonRoles();\n      const categories = await getLocalData<any[]>("person_categories", []);'
  );

  code = code.replace(
    'setPersonRoles(roles as any[]);',
    'setPersonRoles(roles as any[]);\n      setPersonCategories(categories as any[]);'
  );

  // Add to exports
  code = code.replace(
    'personRoles,',
    'personRoles,\n    personCategories,'
  );

  fs.writeFileSync('src/hooks/useAppController.tsx', code);
  console.log('patched');
}
