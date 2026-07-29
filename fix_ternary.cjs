const fs = require('fs');
let lines = fs.readFileSync('src/components/persons/PersonLedger.tsx', 'utf8').split('\n');

// We have syntax errors at specific lines. Let's fix them manually.
// 139, 148, 437, 460, 586, 599, 643, 652, 1191, 1204, 1236, 1243, 1262

// Let's just print the lines around the errors.
[139, 148, 314, 434, 437, 438, 445, 449, 460, 461, 462, 466, 587, 598, 600, 617, 648, 882, 1034, 1198, 1203, 1204, 1205, 1206, 1207, 1213, 1215, 1216, 1256, 1258, 1260, 1262, 1263, 1264, 1265, 1266, 1267, 1269, 1270].forEach(ln => {
    console.log(`--- Line ${ln} ---`);
    for(let i = Math.max(0, ln - 3); i < Math.min(lines.length, ln + 2); i++) {
        console.log(`${i+1}: ${lines[i]}`);
    }
});
