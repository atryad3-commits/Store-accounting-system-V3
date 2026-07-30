const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const appRoutesBlockStart = content.indexOf('  const appRoutes = (\n    <Routes>');
const appRoutesBlockEnd = content.indexOf('</Routes>\n  );\n\n') + '</Routes>\n  );\n\n'.length;

const appRoutesBlock = content.substring(appRoutesBlockStart, appRoutesBlockEnd);

// Remove it from the top
content = content.substring(0, appRoutesBlockStart) + content.substring(appRoutesBlockEnd);

// Find the end of the huge destructuring block
const destructuringEnd = content.indexOf('      } = appState;');
const insertPoint = content.indexOf('if (appState.isStoreSelectionOpen) {', destructuringEnd);

content = content.substring(0, insertPoint) + appRoutesBlock + '\n\n' + content.substring(insertPoint);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx order fixed!');
