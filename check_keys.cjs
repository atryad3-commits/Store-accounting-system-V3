const fs = require('fs');
const glob = require('glob'); // Need to install if not present, but I can use a simple recursive read.

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/key="([^"]+)"/g);
    if (matches) {
        const counts = {};
        matches.forEach(m => {
            counts[m] = (counts[m] || 0) + 1;
        });
        Object.keys(counts).forEach(k => {
            if (counts[k] > 1) {
                console.log(`Duplicate static key ${k} in ${file}`);
            }
        });
    }
});
