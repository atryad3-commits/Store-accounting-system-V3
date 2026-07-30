const fs = require('fs');
let code = fs.readFileSync('src/services/personService.ts', 'utf8');

code = code.replace(
  "const newGroup = { ...group, id: generateId(), createdAt: now, updatedAt: now };",
  "const newGroup = { ...group, id: group.id || generateId(), createdAt: now, updatedAt: now };"
);

code = code.replace(
  "const newRole = { ...role, id: generateId(), createdAt: now, updatedAt: now };",
  "const newRole = { ...role, id: role.id || generateId(), createdAt: now, updatedAt: now };"
);

code = code.replace(
  "const newCategory = { ...category, id: generateId(), createdAt: now, updatedAt: now };",
  "const newCategory = { ...category, id: category.id || generateId(), createdAt: now, updatedAt: now };"
);

fs.writeFileSync('src/services/personService.ts', code);
console.log('patched personService extras');
