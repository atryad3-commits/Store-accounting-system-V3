require('ts-node').register();
const { globalDateFormatter } = require('./src/utils/dateFormatter.ts');

console.log("Before:", globalDateFormatter.getConfig());
globalDateFormatter.updateConfig({ dateSeparator: undefined, dateFormat: 'YYYY/MM/DD' });
console.log("After:", globalDateFormatter.getConfig());
console.log(globalDateFormatter.formatDate('1403/05/11'));
