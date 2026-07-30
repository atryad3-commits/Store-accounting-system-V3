const fs = require('fs');
let code = fs.readFileSync('src/components/modals/PersonFormModal.tsx', 'utf8');

code = code.replace(
  '  personCategories?: any[];\n  personCategories?: any[];',
  '  personCategories?: any[];'
);

code = code.replace(
  '  personCategories = [],\n  personCategories = [],',
  '  personCategories = [],'
);

fs.writeFileSync('src/components/modals/PersonFormModal.tsx', code);
console.log('Fixed duplicate destructuring');
