const { DateObject } = require("react-date-object");
const persian = require("react-date-object/calendars/persian");
const persian_fa = require("react-date-object/locales/persian_fa");

const d1 = new DateObject({ date: "1403/5/21", format: "YYYY/MM/DD", calendar: persian, locale: persian_fa });
console.log(d1.isValid, d1.toDate().toISOString());
