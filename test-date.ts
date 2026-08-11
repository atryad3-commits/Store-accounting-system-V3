import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

try {
    const d = new DateObject({ date: "1403/05/20 12:30", format: "YYYY/MM/DD", calendar: persian, locale: persian_fa });
    console.log(d.isValid);
    console.log(d.toDate().toISOString());
} catch(e) {
    console.log("Error:", e);
}
