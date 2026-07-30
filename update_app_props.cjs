const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = `setNewPersonRole={setNewPersonRole}`;
const injection = `setNewPersonRole={setNewPersonRole} newPersonTaxNumber={appState.newPersonTaxNumber} setNewPersonTaxNumber={appState.setNewPersonTaxNumber} newPersonRegistrationNumber={appState.newPersonRegistrationNumber} setNewPersonRegistrationNumber={appState.setNewPersonRegistrationNumber} newPersonRoles={appState.newPersonRoles} setNewPersonRoles={appState.setNewPersonRoles} newPersonCategories={appState.newPersonCategories} setNewPersonCategories={appState.setNewPersonCategories} duplicatePersonsWarning={appState.duplicatePersonsWarning} setDuplicatePersonsWarning={appState.setDuplicatePersonsWarning}`;

if(!code.includes('setNewPersonTaxNumber={appState.')) {
  code = code.replace(anchor, injection);
  fs.writeFileSync('src/App.tsx', code);
  console.log('App.tsx updated.');
} else {
  console.log('Already updated App.tsx.');
}
