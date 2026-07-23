const fs = require('fs');

const content = fs.readFileSync('src/services/dataService.ts', 'utf8');

const internalFuncs = [];
const internalRegex = /const (\w+)\s*=/g;
let match;
while ((match = internalRegex.exec(content)) !== null) {
  // If it's not exported, and not inside a function... well, it's hard to tell without AST.
  // Let's just find "const name = (" or "const name = async (" at the top level
}

const lines = content.split('\n');
let topLevelConsts = [];
lines.forEach(line => {
    if (line.startsWith('const ') && line.includes(' = ')) {
        topLevelConsts.push(line.split(' ')[1]);
    }
});
console.log("Top level unexported consts:", topLevelConsts);

