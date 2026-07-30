const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

// 1. handleEditPerson
const editAnchor = `setNewPersonRole(p.role);`;
const editInjection = `setNewPersonRole(p.role);
    setNewPersonTaxNumber(p.taxNumber || "");
    setNewPersonRegistrationNumber(p.registrationNumber || "");
    setNewPersonRoles(p.roles || (p.role ? [p.role] : []));
    setNewPersonCategories(p.categories || []);
`;
if(!code.includes('setNewPersonTaxNumber(p.taxNumber')) {
  code = code.replace(editAnchor, editInjection);
}

// 2. newPerson payload in handleSavePerson
// Looking for `role: newPersonRole,`
const saveAnchor = `role: newPersonRole,`;
const saveInjection = `role: newPersonRole,
      roles: newPersonRoles,
      categories: newPersonCategories,
      taxNumber: newPersonTaxNumber,
      registrationNumber: newPersonRegistrationNumber,
`;
if(!code.includes('roles: newPersonRoles,')) {
  code = code.replace(saveAnchor, saveInjection);
}

// 3. reset states in handleSavePerson
const resetAnchor = `setNewPersonRole("");`;
const resetInjection = `setNewPersonRole("");
    setNewPersonTaxNumber("");
    setNewPersonRegistrationNumber("");
    setNewPersonRoles([]);
    setNewPersonCategories([]);
    setDuplicatePersonsWarning([]);
`;
if(!code.includes('setNewPersonTaxNumber("");')) {
  // Replace globally for safety if there are multiple resets
  code = code.split(resetAnchor).join(resetInjection);
}

fs.writeFileSync('src/hooks/useAppController.tsx', code);
console.log('Updated person actions.');
