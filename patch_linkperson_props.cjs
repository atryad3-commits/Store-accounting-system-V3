const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<LinkPerson user={user} persons={persons || []} onPersonLinked={() => window.location.reload()} />',
  '<LinkPerson user={user} persons={persons || []} personRoles={appState.personRoles || []} personGroups={appState.personGroups || []} onPersonLinked={() => window.location.reload()} />'
);

fs.writeFileSync('src/App.tsx', content);
