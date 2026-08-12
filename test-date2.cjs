const DateObjectModule = require("react-date-object");
const persian = require("react-date-object/calendars/persian");
const persian_fa = require("react-date-object/locales/persian_fa");
const gregorian = require("react-date-object/calendars/gregorian");
const gregorian_en = require("react-date-object/locales/gregorian_en");
const DateObject = DateObjectModule.default || DateObjectModule;

const englishStr = "1403/05/20";
const d = new DateObject({ date: englishStr, format: "YYYY/MM/DD", calendar: persian, locale: persian_fa });
d.setCalendar(gregorian);
d.setLocale(gregorian_en);
console.log("Format ISO:", d.format("YYYY-MM-DDTHH:mm:ss.000Z"));

const startDateIso = d.format("YYYY-MM-DD");
const d2 = new DateObject({ date: new Date(startDateIso) });
d2.setCalendar(persian);
d2.setLocale(persian_fa);
console.log("Initial jalali:", d2.format("YYYY/MM/DD"));

const current = new DateObject(d2);
current.add(1, "month");
current.setCalendar(gregorian);
current.setLocale(gregorian_en);
console.log("After add (ISO format):", current.format("YYYY-MM-DD"));
