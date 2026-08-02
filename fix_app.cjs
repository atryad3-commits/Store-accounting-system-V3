const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  if (line.trim().startsWith('<Route path=') && !line.includes('</Route>')) {
      if (line.includes('element={<')) {
          // It's a one line route like <Route path="/xyz" element={<XYZ />} />
          if (!line.endsWith('} />') && !line.endsWith('} >')) {
              // try to fix it
              if (line.match(/[a-zA-Z0-9"']$/)) {
                  lines[i] = line + ' />} />';
              } else if (line.endsWith('}')) {
                  lines[i] = line + ' /> />'.replace('} /> />', '} />'); // wait
              } else if (line.endsWith('/>')) {
                  lines[i] = line + '} />';
              } else if (line.trim().endsWith('/>')) {
                  lines[i] = line + '} />';
              }
          }
      }
  }
}

// Write it back
fs.writeFileSync('src/App.tsx', lines.join('\n'));
