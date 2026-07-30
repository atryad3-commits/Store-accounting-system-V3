const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

const exportAnchor = `  return {
    activeStoreId, setActiveStoreId, availableStores, setAvailableStores, isStoreSelectionOpen, setIsStoreSelectionOpen, productSearchTerm,`;
const exportInjection = `  return {
    newPersonTaxNumber, setNewPersonTaxNumber,
    newPersonRegistrationNumber, setNewPersonRegistrationNumber,
    newPersonRoles, setNewPersonRoles,
    newPersonCategories, setNewPersonCategories,
    duplicatePersonsWarning, setDuplicatePersonsWarning,
    activeStoreId, setActiveStoreId, availableStores, setAvailableStores, isStoreSelectionOpen, setIsStoreSelectionOpen, productSearchTerm,`;

if(code.includes('activeStoreId, setActiveStoreId')) {
    code = code.replace(exportAnchor, exportInjection);
    fs.writeFileSync('src/hooks/useAppController.tsx', code);
    console.log('Fixed exports properly in useAppController');
} else {
    console.log('Not found');
}
