const fs = require('fs');
const files = fs.readdirSync('.', {recursive: true});
const matches = [];
for (const file of files) {
  if (typeof file === 'string' && fs.statSync(file).isFile() && !file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
     const content = fs.readFileSync(file, 'utf8');
     if (content.includes('فاز ششم') || content.includes('فاز بعدی') || content.includes('Phase 6') || content.includes('فاز 6') || content.includes('فاز ۶')) {
        matches.push(file);
     }
  }
}
console.log(matches);
