const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
// Let's just fix the routes!
// We can find all lines starting with <Route
// Then find where they should end, and ensure they end with />} /> or whatever.
