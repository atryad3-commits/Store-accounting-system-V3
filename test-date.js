import DateObjectModule from "react-date-object";
const DateObject = DateObjectModule.default || DateObjectModule;
import persian from "react-date-object/calendars/persian.js";
import persian_fa from "react-date-object/locales/persian_fa.js";

const englishStr = "1403/05/21";
const format = "YYYY/MM/DD";
const d = new DateObject({ date: englishStr, format: format, calendar: persian, locale: persian_fa });
console.log(d.toDate().toISOString());
