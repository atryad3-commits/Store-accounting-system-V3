import re

with open('src/services/dataService.ts', 'r', encoding='utf-8') as f:
    code = f.read()

old_add_code = """  const now = Date.now();
  const newPerson = { ...person, personCode: finalPersonCode, accountingCode: finalAccountingCode, id: generateId(), createdAt: now, updatedAt: now };
  await appendLocalData('persons', newPerson);
  
  if (newPerson.personCode) {
      await updateDocCounter('person', newPerson.personCode);
  }"""

new_add_code = """  const now = Date.now();
  const { contacts, bankAccounts, ...personData } = person;
  const newPerson = { ...personData, personCode: finalPersonCode, accountingCode: finalAccountingCode, id: generateId(), createdAt: now, updatedAt: now };
  await appendLocalData('persons', newPerson);
  
  if (contacts && contacts.length > 0) {
      const allContacts = await getLocalData<any[]>('person_contacts', []);
      await saveLocalData('person_contacts', [...allContacts, ...contacts.map((c: any) => ({...c, personId: newPerson.id}))]);
  }
  if (bankAccounts && bankAccounts.length > 0) {
      const allBanks = await getLocalData<any[]>('person_bank_accounts', []);
      await saveLocalData('person_bank_accounts', [...allBanks, ...bankAccounts.map((b: any) => ({...b, personId: newPerson.id}))]);
  }

  if (newPerson.personCode) {
      await updateDocCounter('person', newPerson.personCode);
  }"""

code = code.replace(old_add_code, new_add_code)

with open('src/services/dataService.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("done")
