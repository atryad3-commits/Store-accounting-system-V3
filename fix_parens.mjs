import fs from 'fs';
import path from 'path';

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk('./src', (err, files) => {
  if (err) throw err;
  files.filter(f => f.endsWith('.tsx')).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const regex = /([a-zA-Z0-9_]+)\.\(([a-zA-Z0-9_]+) \|\| \[\]\)/g;
    if (regex.test(content)) {
        console.log("Fixing in", file);
        content = content.replace(regex, '($1.$2 || [])');
        fs.writeFileSync(file, content);
    }
  });
  console.log("Done");
});
