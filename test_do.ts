import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const d = new DateObject({ date: "1403/05/22", format: "YYYY/MM/DD", calendar: persian, locale: persian_fa });
console.log(d.toDate().toISOString());
