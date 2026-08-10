const DateObject = require("react-date-object").default || require("react-date-object");
const persian = require("react-date-object/calendars/persian").default || require("react-date-object/calendars/persian");
const persian_fa = require("react-date-object/locales/persian_fa").default || require("react-date-object/locales/persian_fa");

function convertToGregorian(dateInput) {
    if (!dateInput) return new Date().toISOString();
    if (typeof dateInput === 'string') {
        if (dateInput.includes('T')) return dateInput; 
        if (dateInput.includes('/')) {
            try {
                const englishStr = dateInput.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
                const year = parseInt(englishStr.split('/')[0], 10);
                if (year < 1500) {
                     const d = new DateObject({ date: englishStr, format: "YYYY/MM/DD", calendar: persian, locale: persian_fa });
                     return d.toDate().toISOString();
                } else {
                     const d = new Date(englishStr);
                     if (!isNaN(d.getTime())) return d.toISOString();
                }
            } catch (e) { }
        }
        const d2 = new Date(dateInput);
        if (!isNaN(d2.getTime())) return d2.toISOString();
        return new Date().toISOString();
    }
    return new Date().toISOString();
}

function formatDate(date) {
    let jsDate = date;
    if (typeof date === 'string' && date.includes('/')) {
        const parsed = new Date(convertToGregorian(date));
        if (!isNaN(parsed.getTime())) jsDate = parsed;
    }
    const dateObj = new DateObject({ date: new Date(jsDate), calendar: persian, locale: persian_fa });
    return dateObj.format("YYYY/MM/DD");
}

function toPersianDigits(str) {
  if (str === undefined || str === null) return '';
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/[0-9]/g, function (w) {
    return id[+w];
  });
}

console.log(toPersianDigits(formatDate("1403/05/11")));
