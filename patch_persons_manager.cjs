const fs = require('fs');
let code = fs.readFileSync('src/components/persons/PersonsManager.tsx', 'utf-8');

code = code.replace(
  'setNewPersonPhone: (v: string) => void;',
  'setNewPersonPhone: (v: string) => void;\n  setNewPersonContacts: (v: any[]) => void;'
);

code = code.replace(
  'setNewPersonPhone,\n    setNewPersonRole,',
  'setNewPersonPhone,\n    setNewPersonContacts,\n    setNewPersonRole,'
);

code = code.replace(
  'setNewPersonPhone("");\n                                setNewPersonRole("customer");',
  'setNewPersonPhone("");\n                                setNewPersonContacts([]);\n                                setNewPersonRole("customer");'
);

fs.writeFileSync('src/components/persons/PersonsManager.tsx', code);
console.log('PersonsManager patched');
