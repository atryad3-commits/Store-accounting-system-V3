import DateObjectModule from "react-date-object";
const DateObject = DateObjectModule.default || DateObjectModule;
import persian from "react-date-object/calendars/persian.js";
import persian_fa from "react-date-object/locales/persian_fa.js";

let dateInput = "1403-5-21";

let normalizedInput = dateInput;
if (normalizedInput.includes('-') && !normalizedInput.includes('T')) {
    normalizedInput = normalizedInput.replace(/-/g, '/');
}
if (normalizedInput.includes('/')) {
    try {
        const englishStr = normalizedInput.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
        const year = parseInt(englishStr.split('/')[0], 10);
        if (year < 1500) { 
             let format = "YYYY/MM/DD";
             const d = new DateObject({ date: englishStr, format: format, calendar: persian, locale: persian_fa });
             console.log("DateObject", d.toDate().toISOString());
        } else {
             const d = new Date(englishStr);
             console.log("Date", d.toISOString());
        }
    } catch (e) {
        console.log(e);
    }
}
