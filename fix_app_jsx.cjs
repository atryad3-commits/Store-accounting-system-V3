const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The replacement above might have hit both PersonsManager and PersonFormModal?
// Actually App.tsx has `personRoles={personRoles}` and `personRoles={appState.personRoles}`
console.log('App.tsx string replacements check...');
