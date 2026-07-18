import re

with open('src/components/persons/PersonLedger.tsx', 'r') as f:
    content = f.read()

content = content.replace("""                                              <div className="absolute top-4 left-4 flex gap-1">
                                                <PersonLedgerActionsDropdown entry={entry} personId={personId} persons={persons} onEdit={onEdit} fetchPersons={fetchPersons} />
                                              </div>""", "")

with open('src/components/persons/PersonLedger.tsx', 'w') as f:
    f.write(content)
