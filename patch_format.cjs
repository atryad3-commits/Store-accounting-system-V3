const fs = require('fs');
const file = 'src/utils/format.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'import DateObject from "react-date-object";',
    `import DateObjectModule from "react-date-object";
const DateObject = (DateObjectModule as any).default || DateObjectModule;`
);

fs.writeFileSync(file, content);
