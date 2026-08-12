const DateObjectModule = require("react-date-object");
const persian = require("react-date-object/calendars/persian");
const persian_fa = require("react-date-object/locales/persian_fa");

const d = new DateObjectModule({ date: new Date("2024-08-12T00:00:00.000Z") });
d.setCalendar(persian);
d.setLocale(persian_fa);
console.log("Original Jalali:", d.format());

for(let i=0; i<3; i++) {
   const current = new DateObjectModule(d);
   if (i > 0) current.add(i, "month");
   console.log(`Month ${i} ISO:`, current.toDate().toISOString().split('T')[0]);
}
