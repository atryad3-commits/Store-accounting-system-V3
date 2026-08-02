const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  // If line ends with `/>} />`, it was added by auto_fix.cjs maybe? No, `} />` was added.
  if (lines[i].endsWith('} />') && !lines[i].includes('/>} />')) {
      // wait, some actually were meant to be `} />`?
      // No, sed removed ALL `} />`! So ANY `} />` currently in the file was added by auto_fix!
      // (Unless it was `} />` with no space, wait, sed removed exactly `} />`).
  }
}

// Let's just manually fix the multi-line elements.
// I see the pattern!
for (let i = 715; i < 1050; i++) {
  if (lines[i].match(/^\s*\/>\s*$/)) {
      lines[i] = lines[i].replace('/>', '/>} />');
  }
}
fs.writeFileSync('src/App.tsx', lines.join('\n'));
