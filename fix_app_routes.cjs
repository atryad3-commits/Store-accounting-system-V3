const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const routesStart = content.indexOf('<Routes>');
const routesEnd = content.indexOf('</Routes>') + '</Routes>'.length;

if (routesStart > -1 && routesEnd > -1) {
    const routesBlock = content.substring(routesStart, routesEnd);
    
    // Replace the Routes block in the original place with a reference
    let newContent = content.substring(0, routesStart) + '{appRoutes}' + content.substring(routesEnd);
    
    // Insert the appRoutes definition before the return statement of App
    const returnIndex = newContent.lastIndexOf('return (', routesStart);
    
    newContent = newContent.substring(0, returnIndex) + 
                 '\n  const appRoutes = (\n    ' + routesBlock + '\n  );\n\n  ' + 
                 newContent.substring(returnIndex);
                 
    // Now also fix our AdminLTELayout injection
    newContent = newContent.replace('{renderTabContent()}', '{appRoutes}');

    fs.writeFileSync('src/App.tsx', newContent);
    console.log('App.tsx routes extracted successfully!');
} else {
    console.log('Could not find Routes block');
}
