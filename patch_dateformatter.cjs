const fs = require('fs');
const file = 'src/utils/dateFormatter.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'import DateObject from "react-date-object";',
    `import DateObjectModule from "react-date-object";\nconst DateObject = (DateObjectModule as any).default || DateObjectModule;`
);

fs.writeFileSync(file, content);
