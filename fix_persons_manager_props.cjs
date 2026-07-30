const fs = require('fs');
let code = fs.readFileSync('src/components/persons/PersonsManager.tsx', 'utf8');

const anchor = `setNewPersonRole,`;
const injection = `setNewPersonRole,
    newPersonTaxNumber,
    setNewPersonTaxNumber,
    newPersonRegistrationNumber,
    setNewPersonRegistrationNumber,
    newPersonRoles,
    setNewPersonRoles,
    newPersonCategories,
    setNewPersonCategories,
    duplicatePersonsWarning,
    setDuplicatePersonsWarning,`;

if (!code.includes('newPersonTaxNumber,')) {
    code = code.replace(anchor, injection);
    fs.writeFileSync('src/components/persons/PersonsManager.tsx', code);
    console.log('Updated PersonsManager props.');
} else {
    console.log('Already updated PersonsManager props.');
}
