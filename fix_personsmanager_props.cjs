const fs = require('fs');
let code = fs.readFileSync('src/components/persons/PersonsManager.tsx', 'utf8');

if (!code.includes('personCategories?: any[];')) {
  code = code.replace(
    'personRoles: any[];',
    'personRoles: any[];\n  personCategories?: any[];'
  );
  
  code = code.replace(
    'personRoles,',
    'personRoles,\n  personCategories = [],'
  );
  
  fs.writeFileSync('src/components/persons/PersonsManager.tsx', code);
  console.log('Added personCategories to PersonsManager props');
}
