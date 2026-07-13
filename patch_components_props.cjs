const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  '<InvoicesList\n             invoices={invoices}',
  '<InvoicesList\n             setIsReceiveModalOpen={setIsReceiveModalOpen} setIsPayModalOpen={setIsPayModalOpen} invoices={invoices}'
);

content = content.replace(
  '<PersonsManager\n                    persons={persons}',
  '<PersonsManager\n                    setIsReceiveModalOpen={setIsReceiveModalOpen}\n                    setIsPayModalOpen={setIsPayModalOpen}\n                    persons={persons}'
);

content = content.replace(
  '<PersonLedgerActionsDropdown\n                        person={viewingPerson}',
  '<PersonLedgerActionsDropdown\n                        setIsReceiveModalOpen={setIsReceiveModalOpen}\n                        setIsPayModalOpen={setIsPayModalOpen}\n                        person={viewingPerson}'
);

fs.writeFileSync('src/App.tsx', content);
