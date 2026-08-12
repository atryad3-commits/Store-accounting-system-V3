import DateObjectModule from "react-date-object";
const DateObject = DateObjectModule.default || DateObjectModule;
import persian from "react-date-object/calendars/persian.js";
import persian_fa from "react-date-object/locales/persian_fa.js";

function convert(dateInput) {
    if (!dateInput) return new Date().toISOString();
    if (typeof dateInput === 'string') {
        if (dateInput.includes('T')) return dateInput; 
        
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
                     return d.toDate().toISOString();
                } else {
                     const d = new Date(englishStr);
                     if (!isNaN(d.getTime())) return d.toISOString();
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    return new Date().toISOString();
}

console.log("convert('1403/05/25')", convert('1403/05/25'));
console.log("convert('1403/5/25')", convert('1403/5/25')); // Notice no leading zero
console.log("convert('1403-5-25')", convert('1403-5-25'));
