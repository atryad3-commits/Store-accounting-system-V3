const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const startPattern = '{activeTab === "products" ? (';
const endPattern = ') : null}';
const startIndex = appTsx.indexOf(startPattern);
const endIndex = appTsx.lastIndexOf(endPattern);

if (startIndex === -1 || endIndex === -1) {
    console.log("Not found.");
    process.exit(1);
}

const ternaryBlock = appTsx.substring(startIndex, endIndex + endPattern.length);

// Instead of regex, let's write a simple state machine parser to handle nested parens
let i = 0;
let state = 'EXPECT_CONDITION'; // EXPECT_CONDITION, EXPECT_COMPONENT
let currentTab = '';
let currentComponent = '';
let currentNesting = 0;
let routes = [];

// Remove '{activeTab === ' and ' : null}' to simplify
let code = ternaryBlock.substring(1, ternaryBlock.length - 8).trim(); 
// code should start with `activeTab === "products" ? (`

while (i < code.length) {
    if (state === 'EXPECT_CONDITION') {
        // match `activeTab === "tab_name" ? (`
        const match = code.substring(i).match(/^activeTab === "(.*?)" \? \(/);
        if (match) {
            currentTab = match[1];
            i += match[0].length;
            state = 'EXPECT_COMPONENT';
            currentComponent = '';
            currentNesting = 1; // we passed one opening paren
        } else {
            console.log("Parse error at:", code.substring(i, i+100));
            break;
        }
    } else if (state === 'EXPECT_COMPONENT') {
        const char = code[i];
        if (char === '(') currentNesting++;
        else if (char === ')') currentNesting--;
        
        if (currentNesting === 0) {
            // we reached the end of the component block
            routes.push({ tab: currentTab, comp: currentComponent.trim() });
            i++; // skip ')'
            // Next should be ` : activeTab ===`
            const nextMatch = code.substring(i).match(/^\s*: /);
            if (nextMatch) {
                i += nextMatch[0].length;
                state = 'EXPECT_CONDITION';
            } else {
                // Done?
                break;
            }
        } else {
            currentComponent += char;
            i++;
        }
    }
}

console.log(`Parsed ${routes.length} routes.`);

if (routes.length > 0) {
    let newBlock = `<Routes>\n`;
    for (let r of routes) {
        newBlock += `  <Route path="/${r.tab}" element={${r.comp}} />\n`;
    }
    // Add fallback for default path or unknown
    newBlock += `  <Route path="/" element={<Navigate to="/welcome_page" replace />} />\n`;
    newBlock += `  <Route path="*" element={<Navigate to="/welcome_page" replace />} />\n`;
    newBlock += `</Routes>`;

    const newAppTsx = appTsx.substring(0, startIndex) + newBlock + appTsx.substring(endIndex + endPattern.length);
    fs.writeFileSync('src/App.tsx', newAppTsx);
    console.log("Successfully replaced ternary with Routes in App.tsx.");
}
