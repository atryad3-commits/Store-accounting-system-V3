const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

file = file.replace(
  /<button\s+onClick=\{\(\) => setIsCalculatorOpen\(true\)\}/,
  `<NotificationBell />
                      <button
                        onClick={() => setIsCalculatorOpen(true)}`
);

fs.writeFileSync('src/App.tsx', file);
