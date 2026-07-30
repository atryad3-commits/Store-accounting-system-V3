const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

// The faulty line was: `const [personRoles,\n    personCategories, setPersonRoles] = useState<any[]>([]);`
code = code.replace(
  'const [personRoles,\n    personCategories, setPersonRoles] = useState<any[]>([]);\n  const [personCategories, setPersonCategories] = useState<any[]>([]);',
  'const [personRoles, setPersonRoles] = useState<any[]>([]);\n  const [personCategories, setPersonCategories] = useState<any[]>([]);'
);

fs.writeFileSync('src/hooks/useAppController.tsx', code);
