const fs = require('fs');
let code = fs.readFileSync('src/components/persons/PersonLedger.tsx', 'utf-8');

// Add import
const importNotes = "import PersonNotesAndAttachments from '../financial/PersonNotesAndAttachments';";
const newImport = importNotes + "\nimport PersonCRMLedger from '../crm/PersonCRMLedger';";
code = code.replace(importNotes, newImport);

// Add tab button
const oldNotesTab = `<button
                              onClick={() => setLedgerTab("notes")}
                              className={\`py-3 px-1 font-bold text-sm border-b-2 transition-all \${ledgerTab === "notes" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}\`}
                            >
                              یادداشت‌ها و پیوست‌ها
                            </button>`;
const newCrmTab = oldNotesTab + `
                            <button
                              onClick={() => setLedgerTab("crm")}
                              className={\`py-3 px-1 font-bold text-sm border-b-2 transition-all \${ledgerTab === "crm" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}\`}
                            >
                              پیگیری‌ها (CRM)
                            </button>`;
code = code.replace(oldNotesTab, newCrmTab);

// Add tab content render
const oldNotesRender = `{ledgerTab === "notes" ? (
                            <PersonNotesAndAttachments
                              person={selectedPerson}
                              fetchPersons={fetchPersons}
                              showNotification={showNotification}
                            />
                          ) : `;
const newCrmRender = `{ledgerTab === "crm" ? (
                            <PersonCRMLedger person={selectedPerson} storeSettings={storeSettings} />
                          ) : ledgerTab === "notes" ? (
                            <PersonNotesAndAttachments
                              person={selectedPerson}
                              fetchPersons={fetchPersons}
                              showNotification={showNotification}
                            />
                          ) : `;
code = code.replace(oldNotesRender, newCrmRender);

fs.writeFileSync('src/components/persons/PersonLedger.tsx', code, 'utf-8');
console.log('Patched PersonLedger for CRM');
