const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.trim().startsWith('<Route ') && line.includes('element={<')) {
        // Count { and }
        let open = (line.match(/\{/g) || []).length;
        let close = (line.match(/\}/g) || []).length;
        
        // If it's a multi-line route, we shouldn't balance it on this line, unless it's already closed with />} />
        if (line.trim().endsWith('/>} />') || line.trim().endsWith(' />} />') || line.trim().endsWith('/>')) {
            // It SHOULD be balanced!
            while (open > close) {
                // We need to add } before the final />
                // Let's replace the final /> with } />
                line = line.replace(/(\s*\/>)$/, '}$1');
                close++;
            }
            // wait, what if we have TOO MANY }?
            // e.g. } />} />
            lines[i] = line;
        }
    } else if (line.match(/^\s*\/>\s*$/)) {
        // this is a multi line end. It should be />} />
        // wait, we already made it />} />
    }
}
fs.writeFileSync('src/App.tsx', lines.join('\n'));
