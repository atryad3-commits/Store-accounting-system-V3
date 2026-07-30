const fs = require('fs');
let code = fs.readFileSync('src/components/modals/PersonFormModal.tsx', 'utf8');

const roleMatch = `        role: newPersonRole,`;
const roleReplace = `        role: newPersonRole,
        roles: newPersonRoles,
        categories: newPersonCategories,`;

if (!code.includes('roles: newPersonRoles,')) {
    code = code.replace(roleMatch, roleReplace);
}

// Ensure resetting newPersonRoles and categories
const resetMatch = `      setNewPersonRole("customer");`;
const resetReplace = `      setNewPersonRole("customer");
      setNewPersonRoles([]);
      setNewPersonCategories([]);`;
if (!code.includes('setNewPersonRoles([]);')) {
    code = code.replace(resetMatch, resetReplace); // inside handleSavePerson success
    code = code.replace(resetMatch, resetReplace); // in another place if it exists
}

// In useEffect for edit mode
const editModeMatch = `          setNewPersonRole(person.role || "customer");`;
const editModeReplace = `          setNewPersonRole(person.role || "customer");
          setNewPersonRoles(person.roles || (person.role ? [person.role] : []));
          setNewPersonCategories(person.categories || []);`;
if(!code.includes('setNewPersonRoles(person.roles')) {
    code = code.replace(editModeMatch, editModeReplace);
}


fs.writeFileSync('src/components/modals/PersonFormModal.tsx', code);
console.log('Fixed payload and edit mode.');
