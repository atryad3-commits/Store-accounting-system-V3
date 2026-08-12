import DateObjectModule from "react-date-object";
const DateObject = DateObjectModule.default || DateObjectModule;
import persian from "react-date-object/calendars/persian.js";
import persian_fa from "react-date-object/locales/persian_fa.js";

function convertToGregorian(dateInput) {
    if (!dateInput) return new Date().toISOString();
    if (typeof dateInput.toDate === 'function') {
        return dateInput.toDate().toISOString();
    }
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
                     if (englishStr.includes(':')) {
                         if (englishStr.includes('am') || englishStr.includes('pm')) {
                             format = "YYYY/MM/DD hh:mm a";
                         } else {
                             format = englishStr.split(':').length === 3 ? "YYYY/MM/DD HH:mm:ss" : "YYYY/MM/DD HH:mm";
                         }
                     }
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
        const d2 = new Date(dateInput);
        if (!isNaN(d2.getTime())) return d2.toISOString();
        return new Date().toISOString();
    }
    if (dateInput instanceof Date) {
        if (!isNaN(dateInput.getTime())) return dateInput.toISOString();
    }
    return new Date().toISOString();
}

console.log("Result:", convertToGregorian("1403/06/21"));
