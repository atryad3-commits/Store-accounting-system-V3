const DateObject = require("react-date-object").default || require("react-date-object");
const persian = require("react-date-object/calendars/persian").default || require("react-date-object/calendars/persian");
const persian_fa = require("react-date-object/locales/persian_fa").default || require("react-date-object/locales/persian_fa");

const d = new DateObject({ date: "1403/5/21", format: "YYYY/MM/DD", calendar: persian, locale: persian_fa });
console.log(d.isValid, d.toDate().toISOString());
