const fs = require('fs');
let content = fs.readFileSync('src/components/profile/LinkPerson.tsx', 'utf8');

content = content.replace(
  /label: `\\[\\\${p\\.personCode.*`/,
  "label: `[${p.personCode || 'بدون کد'}] ${p.name} - ${p.nationalId || 'بدون کدملی'} - ${p.phone || 'بدون تلفن'}`"
);

fs.writeFileSync('src/components/profile/LinkPerson.tsx', content);
