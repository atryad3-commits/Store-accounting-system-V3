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
    
    // Remove all trailing broken tags from the END of the string
    routeStr = routeStr.replace(/\}\s*\/>\s*\}\s*\/>/g, ''); 
    routeStr = routeStr.replace(/\}\s*\/>/g, ''); 
    routeStr = routeStr.replace(/\/>/g, ''); 
    
    // Remove any ` />` from the middle, except valid ones if any
    
    if (routeStr.includes('AnimatePresence')) {
        newRoutesBlock += `  <Route path="*" element={<AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="h-full flex flex-col">{renderTabContent()}</motion.div></AnimatePresence>} />\n`;
        continue;
    }

    if (routeStr.includes('<motion.div')) {
        // It has a motion.div wrapper
        // The component inside is missing its closing } />
        routeStr = routeStr.replace(/<\/motion\.div>/g, ''); // remove it so we can re-add it cleanly
        routeStr = routeStr.trimEnd();
        
        // Ensure the inner component is closed properly
        // If it ends with something like `val}`, we add ` />`
        // Wait, if we removed `} />`, then `prop={val` is missing `}`
        if (!routeStr.endsWith('}')) {
             routeStr += '}';
        }
        routeStr += ' />\n</motion.div>} />\n';
    } else {
        routeStr = routeStr.trimEnd();
        if (!routeStr.endsWith('}')) {
             routeStr += '}';
        }
        routeStr += ' />} />\n';
    }
    
    newRoutesBlock += routeStr;
}

newRoutesBlock += '</Routes>';

fs.writeFileSync('src/App.tsx', beforeRoutes + newRoutesBlock + afterRoutes);
