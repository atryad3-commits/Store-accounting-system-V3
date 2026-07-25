const fs = require('fs');
const file = 'src/components/modals/ProductPriceHistoryModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import { format } from "date-fns-jalali";',
  'import DateObject from "react-date-object";\nimport persian from "react-date-object/calendars/persian";\nimport persian_fa from "react-date-object/locales/persian_fa";'
);

content = content.replace(
  'format(new Date(h.date), "yyyy/MM/dd HH:mm")',
  'new DateObject(new Date(h.date)).convert(persian, persian_fa).format("YYYY/MM/DD HH:mm")'
);

fs.writeFileSync(file, content);
