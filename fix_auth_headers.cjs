const fs = require('fs');
let content = fs.readFileSync('src/services/dataService.ts', 'utf8');

content = content.replace(/headers:\s*\{/g, "headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('access_token') || ''), ");

fs.writeFileSync('src/services/dataService.ts', content);
console.log("Updated dataService.ts");
