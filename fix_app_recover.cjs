const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The file is broken inside the <Routes> block.
// Let's grab everything before <Routes> and everything after </Routes>
let beforeRoutes = content.substring(0, content.indexOf('<Routes>'));
let afterRoutes = content.substring(content.indexOf('</Routes>') + '</Routes>'.length);

let routesBlock = content.substring(content.indexOf('<Routes>') + '<Routes>'.length, content.indexOf('</Routes>'));

// Now we need to parse the broken routesBlock.
// We know a route starts with `<Route path="...`
// And we want to extract everything until the next `<Route` or the end.
let routeStrings = [];
let currentIndex = 0;
while (true) {
    let nextIndex = routesBlock.indexOf('<Route ', currentIndex + 1);
    if (nextIndex === -1) {
        routeStrings.push(routesBlock.substring(currentIndex));
        break;
    }
    routeStrings.push(routesBlock.substring(currentIndex, nextIndex));
    currentIndex = nextIndex;
}

let newRoutesBlock = '';
for (let routeStr of routeStrings) {
    if (!routeStr.trim()) continue;
    
    // We have a string that looks like:
    // <Route path="/xyz" element={<XYZ prop1={val1} prop2={val2} 
    // And it might have random `} />` or missing `} />`
    
    // Let's strip ALL instances of `} />`, `/>`, `}} />`, etc from the end of it!
    // Actually, let's just strip everything after the LAST prop!
    // How?
    
    // First, normalize it a bit.
    let cleaned = routeStr.replace(/\}\s*\/>/g, ''); // remove all } />
    cleaned = cleaned.replace(/\/>/g, ''); // remove all />
    
    // Now it's just `<Route path="..." element={<XYZ prop1={val1}`
    // Or it might be multi-line:
    // <Route path="..." element={<XYZ
    //   prop1={val1}
    //   prop2={val2}
    
    // Let's ensure it ends with ` />} />\n`
    cleaned = cleaned.trimEnd() + ' />} />\n';
    
    // BUT what if it had inner children? Like `<motion.div> ... </motion.div>`?
    if (cleaned.includes('<motion.div')) {
        // This is complex. Let's just restore it carefully if needed.
        // Actually, we can just print the cleaned version to see what we have.
    }
    
    newRoutesBlock += cleaned + '\n';
}

fs.writeFileSync('src/App.tsx.routes', newRoutesBlock);
