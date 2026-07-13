const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const ternaryStart = code.indexOf('activeTab === "create_receive_receipt" ?');
const ternaryEnd = code.indexOf(') : null}', ternaryStart);

const tabs = new Set();
if (ternaryStart !== -1 && ternaryEnd !== -1) {
  const ternaryCode = code.substring(ternaryStart, ternaryEnd);
  const regexLocal = /activeTab === "([^"]+)"/g;
  let match;
  while ((match = regexLocal.exec(ternaryCode)) !== null) {
    tabs.add(match[1]);
  }
}

// Add the very first one which doesn't have activeTab === inside because we matched from it
tabs.add('create_receive_receipt');
tabs.add('create_pay_receipt');

const arrStart = code.indexOf('{![');
const arrEnd = code.indexOf('].includes(activeTab) && renderTabContent()}');

if (arrStart !== -1 && arrEnd !== -1 && tabs.size > 0) {
   const tabsArr = Array.from(tabs);
   const formatted = tabsArr.map(t => '                  "' + t + '",').join('\n');
   const newArrCode = '{![\n' + formatted + '\n                ].includes(activeTab) && renderTabContent()}';
   code = code.substring(0, arrStart) + newArrCode + code.substring(arrEnd + 44);
   fs.writeFileSync(file, code);
   console.log('Fixed exclusion list.');
} else {
   console.log('Could not find arrStart or arrEnd');
}
