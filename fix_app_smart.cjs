const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length - 1; i++) {
  let line = lines[i];
  let nextLine = lines[i+1].trim();
  
  if (line.includes('<Route path=') && line.endsWith(' />} />')) {
      // Is it a multi-line route?
      // A single line route will be followed by another <Route, or </Routes>, or something like {appState... (wait, no)
      // Multi-line route will be followed by props, like `prop={value}`, `formatCurrency={...}`, `setActiveTab={...}`, `{...appState}`
      // If the next line doesn't start with <Route, </Routes>, or is empty...
      if (nextLine.length > 0 && !nextLine.startsWith('<Route') && !nextLine.startsWith('</Route') && !nextLine.startsWith('{/*') && !nextLine.startsWith('<')) {
          // This must be a multi-line component!
          // We should remove the ` />} />` that fix_app.cjs added!
          lines[i] = line.replace(' />} />', '');
      }
  }
}

// Now fix the closing of the elements!
let inRoutes = false;
let openRoute = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<Routes>')) inRoutes = true;
    if (lines[i].includes('</Routes>')) inRoutes = false;

    if (inRoutes) {
        // If we see a line that is EXACTLY spaces followed by `/>` or `/> `
        if (lines[i].match(/^\s*\/>\s*$/)) {
            // It must be the close of a multi-line element!
            lines[i] = lines[i].replace('/>', '/>} />');
        }
    }
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
