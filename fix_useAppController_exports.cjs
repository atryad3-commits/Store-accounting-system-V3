const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

const exportAnchor = `  return {`;
const exportInjection = `  return {
    newPersonTaxNumber, setNewPersonTaxNumber,
    newPersonRegistrationNumber, setNewPersonRegistrationNumber,
    newPersonRoles, setNewPersonRoles,
    newPersonCategories, setNewPersonCategories,
    duplicatePersonsWarning, setDuplicatePersonsWarning,`;

if(!code.includes('newPersonTaxNumber, setNewPersonTaxNumber,')) {
    code = code.replace(exportAnchor, exportInjection);
    fs.writeFileSync('src/hooks/useAppController.tsx', code);
    console.log('Fixed exports in useAppController');
} else {
    console.log('Already exported');
}
