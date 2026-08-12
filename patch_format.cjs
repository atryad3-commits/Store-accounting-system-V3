const fs = require('fs');
let code = fs.readFileSync('src/utils/format.ts', 'utf8');

if (!code.includes('import gregorian')) {
    code = code.replace(
        /import persian_fa from "react-date-object\/locales\/persian_fa";/,
        `import persian_fa from "react-date-object/locales/persian_fa";\nimport gregorian from "react-date-object/calendars/gregorian";\nimport gregorian_en from "react-date-object/locales/gregorian_en";`
    );
}

code = code.replace(
    /const d = new DateObject\(\{ date: englishStr, format: format, calendar: persian, locale: persian_fa \}\);\n\s*return d\.toDate\(\)\.toISOString\(\);/,
    `const d = new DateObject({ date: englishStr, format: format, calendar: persian, locale: persian_fa });
                     d.setCalendar(gregorian);
                     d.setLocale(gregorian_en);
                     return d.format("YYYY-MM-DDTHH:mm:ss.000Z");`
);

fs.writeFileSync('src/utils/format.ts', code);
