const fs = require('fs');
let code = fs.readFileSync('src/utils/installmentUtils.ts', 'utf8');

code = code.replace(
    /const d = new DateObject\(\{ date: new Date\(startDateIso\) \}\);/,
    `const d = new DateObject({ date: startDateIso, format: "YYYY-MM-DD" });`
);

code = code.replace(
    /dates.push\(current.toDate\(\).toISOString\(\).split\('T'\)\[0\]\);/,
    `const localIso = new Date(current.toDate().getTime() - current.toDate().getTimezoneOffset() * 60000).toISOString().split('T')[0];
        dates.push(localIso);`
);

fs.writeFileSync('src/utils/installmentUtils.ts', code);
