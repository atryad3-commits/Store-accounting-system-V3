const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

let inRoutes = false;
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.includes('<Routes>')) inRoutes = true;
    if (line.includes('</Routes>')) inRoutes = false;

    if (inRoutes) {
        // Strip out all the garbage we added
        line = line.replace(/\} \/>/g, ''); // strip all '} />'
        line = line.replace(/\/>/g, ''); // strip all '/>'
        line = line.replace(/}} />/g, ''); // strip garbage
        line = line.replace(/} \/>}/g, ''); 
        lines[i] = line;
    }
}
fs.writeFileSync('src/App.tsx.stripped', lines.join('\n'));
