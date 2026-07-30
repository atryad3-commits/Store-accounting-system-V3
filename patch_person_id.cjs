const fs = require('fs');
let code = fs.readFileSync('src/services/personService.ts', 'utf8');

code = code.replace(
  "const newPerson = { ...personData, personCode: finalPersonCode, accountingCode: finalAccountingCode, id: generateId(), createdAt: now, updatedAt: now };",
  "const newPerson = { ...personData, personCode: finalPersonCode, accountingCode: finalAccountingCode, id: personData.id || generateId(), createdAt: now, updatedAt: now };"
);

fs.writeFileSync('src/services/personService.ts', code);
console.log('patched personService');
