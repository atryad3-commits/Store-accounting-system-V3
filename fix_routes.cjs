const fs = require('fs');
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const wildcard = `  <Route path="/" element={<Navigate to="/welcome_page" replace />} />\n  <Route path="*" element={<Navigate to="/welcome_page" replace />} />`;
const replaceWith = `  <Route path="/" element={<Navigate to="/welcome_page" replace />} />\n  <Route path="*" element={<AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="h-full flex flex-col">{renderTabContent()}</motion.div></AnimatePresence>} />`;

if (appTsx.includes(wildcard)) {
    appTsx = appTsx.replace(wildcard, replaceWith);
    fs.writeFileSync('src/App.tsx', appTsx);
    console.log("Fixed wildcard route to use renderTabContent");
} else {
    console.log("Not found.");
}
