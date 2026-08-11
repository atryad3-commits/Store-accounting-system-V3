const DateObject = require("react-date-object").default || require("react-date-object");
const persian = require("react-date-object/calendars/persian").default || require("react-date-object/calendars/persian");
const persian_fa = require("react-date-object/locales/persian_fa").default || require("react-date-object/locales/persian_fa");

const d2 = new DateObject({ date: "1403/05/21 12:30", format: "YYYY/MM/DD HH:mm", calendar: persian, locale: persian_fa });
console.log(d2.isValid, d2.toDate().toISOString());
