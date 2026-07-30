const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

const badInjectionMatch = `          return {
    newPersonTaxNumber, setNewPersonTaxNumber,
    newPersonRegistrationNumber, setNewPersonRegistrationNumber,
    newPersonRoles, setNewPersonRoles,
    newPersonCategories, setNewPersonCategories,
    duplicatePersonsWarning, setDuplicatePersonsWarning,`;

if(code.includes(badInjectionMatch)) {
    code = code.replace(badInjectionMatch, `          return {`);
    
    // Now inject it at the very end
    const realExportMatch = `  return {
    activeStoreId, setActiveStoreId, availableStores, setAvailableStores, isStoreSelectionOpen, setIsStoreSelectionOpen, productSearchTerm,`;
    
    const realExportReplacement = `  return {
    newPersonTaxNumber, setNewPersonTaxNumber,
    newPersonRegistrationNumber, setNewPersonRegistrationNumber,
    newPersonRoles, setNewPersonRoles,
    newPersonCategories, setNewPersonCategories,
    duplicatePersonsWarning, setDuplicatePersonsWarning,
    activeStoreId, setActiveStoreId, availableStores, setAvailableStores, isStoreSelectionOpen, setIsStoreSelectionOpen, productSearchTerm,`;
    
    code = code.replace(realExportMatch, realExportReplacement);
    
    fs.writeFileSync('src/hooks/useAppController.tsx', code);
    console.log('Fixed the wrong injection location.');
} else {
    console.log('Not found bad injection.');
}
