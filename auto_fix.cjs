const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  if (line.includes('<Route path=')) {
      if (!line.includes('</Route>') && !line.match(/\/>\s*$/) && !line.match(/}\s*$/) && !line.match(/}\s*\/>\s*$/)) {
          // If it ends with a property without closing tag
          if (line.match(/[a-zA-Z0-9"']$/) || line.match(/\]$/)) {
              lines[i] = line + '} />';
          }
      }
      
      // Some lines might have been `<Component` and nothing else.
  }
}
fs.writeFileSync('src/App.tsx', lines.join('\n'));
