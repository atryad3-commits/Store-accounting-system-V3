const fs = require('fs');
let file = fs.readFileSync('src/services/coreService.ts', 'utf8');

file = file.replace(
  /if \(!res\.ok\) \{\s*if \(res\.status === 401\) return data as T;\s*throw new Error\('Network response was not ok'\);\s*\}/,
  `if (!res.ok) {
    if (res.status === 401) return data as T;
    let errText = 'Network response was not ok';
    try {
       const err = await res.json();
       if (err && err.error) errText = err.error;
    } catch(e) {}
    throw new Error(errText);
  }`
);

fs.writeFileSync('src/services/coreService.ts', file);
