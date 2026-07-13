const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');

const searchStr = 'const handleDateChange = ';
const idx = lines.findIndex(l => l.includes(searchStr));
if (idx > -1) {
    console.log("Found at", idx);
} else {
    console.log("Not found");
}
