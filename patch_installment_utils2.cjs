const fs = require('fs');
let code = fs.readFileSync('src/utils/installmentUtils.ts', 'utf8');

if (!code.includes('gregorian')) {
    code = code.replace(
        /import persian_fa from "react-date-object\/locales\/persian_fa";/,
        `import persian_fa from "react-date-object/locales/persian_fa";\nimport gregorian from "react-date-object/calendars/gregorian";\nimport gregorian_en from "react-date-object/locales/gregorian_en";`
    );
}

code = code.replace(
    /dates\.push\(current\.toDate\(\)\.toISOString\(\)\.split\('T'\)\[0\]\);/g,
    `
        current.setCalendar(gregorian);
        current.setLocale(gregorian_en);
        dates.push(current.format("YYYY-MM-DD"));
    `
);

fs.writeFileSync('src/utils/installmentUtils.ts', code);
