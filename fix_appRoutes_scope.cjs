const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Find the declaration of appRoutes
const appRoutesDeclStart = content.indexOf('  const appRoutes = (\n    <Routes>');
const appRoutesDeclEnd = content.indexOf('</Routes>\n  );\n\n') + '</Routes>\n  );\n\n'.length;

if (appRoutesDeclStart > -1 && appRoutesDeclEnd > -1) {
    // 2. Extract it
    const appRoutesBlock = content.substring(appRoutesDeclStart, appRoutesDeclEnd);
    
    // 3. Remove it from its current bad location
    content = content.substring(0, appRoutesDeclStart) + 'return (' + content.substring(appRoutesDeclEnd);
    
    // 4. Place it right at the top of the App function body
    // Let's find: `const appState = useAppController();`
    const insertPoint = content.indexOf('const appState = useAppController();');
    
    content = content.substring(0, insertPoint) + appRoutesBlock + '\n  ' + content.substring(insertPoint);
    
    fs.writeFileSync('src/App.tsx', content);
    console.log('App.tsx scope fixed!');
} else {
    console.log('Could not find appRoutes declaration');
}
