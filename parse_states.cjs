const fs = require('fs');

const code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

const personsRelated = [];
const lines = code.split('\n');

for (const line of lines) {
    if (line.includes('const [') && (line.toLowerCase().includes('person') || line.toLowerCase().includes('group') || line.toLowerCase().includes('role'))) {
        personsRelated.push(line.trim());
    }
}

console.log(personsRelated.join('\n'));
