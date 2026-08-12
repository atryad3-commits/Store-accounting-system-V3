const fs = require('fs');
let code = fs.readFileSync('src/utils/installmentUtils.ts', 'utf8');

if (!code.includes('DateObject')) {
    code = `import DateObjectModule from "react-date-object";\nimport persian from "react-date-object/calendars/persian";\nimport persian_fa from "react-date-object/locales/persian_fa";\nconst DateObject = (DateObjectModule as any).default || DateObjectModule;\n\n` + code;
}

code += `
export function calculateInstallmentDates(startDateIso: string, count: number, frequency: 'monthly'|'quarterly'|'yearly', calendarType: 'gregorian'|'jalali'): string[] {
    const dates: string[] = [];
    const stepMonths = frequency === 'yearly' ? 12 : frequency === 'quarterly' ? 3 : 1;
    
    // We parse the ISO string (which is standard Gregorian) into a DateObject
    // But we set its calendar to the system's calendar, so adding months respects that calendar's lengths
    const d = new DateObject({ date: new Date(startDateIso) });
    if (calendarType === 'jalali') {
        d.setCalendar(persian);
        d.setLocale(persian_fa);
    }
    
    for (let i = 0; i < count; i++) {
        const current = new DateObject(d);
        if (i > 0) {
            current.add(i * stepMonths, "month");
        }
        // Convert back to ISO (Gregorian) string for storage
        // DateObject natively supports .toDate()
        dates.push(current.toDate().toISOString().split('T')[0]);
    }
    return dates;
}
`;

fs.writeFileSync('src/utils/installmentUtils.ts', code);
