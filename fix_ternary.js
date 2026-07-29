const fs = require('fs');
let code = fs.readFileSync('src/components/persons/PersonLedger.tsx', 'utf8');

// The issue: `) : (` got replaced with `  ` (two spaces, or one space?)
// Let's check what it was replaced with.
// Actually I did `sed -i 's/) : (/ /g'`, so it got replaced by ONE space!

