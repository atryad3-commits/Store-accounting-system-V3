const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

let beforeRoutes = content.substring(0, content.indexOf('<Routes>'));
let afterRoutes = content.substring(content.indexOf('</Routes>') + '</Routes>'.length);
let routesBlock = content.substring(content.indexOf('<Routes>') + '<Routes>'.length, content.indexOf('</Routes>'));

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

let newRoutesBlock = '<Routes>\n';
for (let routeStr of routeStrings) {
    if (!routeStr.trim()) continue;
    if (routeStr.includes('AnimatePresence')) {
        newRoutesBlock += `  <Route path="*" element={<AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="h-full flex flex-col">{renderTabContent()}</motion.div></AnimatePresence>} />\n`;
        continue;
    }

    // Strip ALL appended tags from previous fixes
    routeStr = routeStr.replace(/\}\s*\/>\s*\}\s*\/>/g, ''); 
    routeStr = routeStr.replace(/\}\s*\/>/g, ''); 
    routeStr = routeStr.replace(/\/>/g, ''); 
    routeStr = routeStr.replace(/<\/motion\.div>/g, '');
    
    // Now routeStr is pure, just the broken React code with missing } and missing />
    // Count open { and close }
    let open = (routeStr.match(/\{/g) || []).length;
    let close = (routeStr.match(/\}/g) || []).length;
    
    let missing = open - close;
    
    routeStr = routeStr.trimEnd();
    
    // Add missing } for props
    if (missing > 1) {
        routeStr += '}'.repeat(missing - 1);
    }
    
    // Now close the component
    routeStr += ' />';
    
    // If it was a motion div, we close it
    if (routeStr.includes('<motion.div')) {
        routeStr += '\n                      </motion.div>';
    }
    
    // Close the element prop and the route
    routeStr += '} />\n';
    
    newRoutesBlock += routeStr;
}
newRoutesBlock += '</Routes>';

fs.writeFileSync('src/App.tsx', beforeRoutes + newRoutesBlock + afterRoutes);
