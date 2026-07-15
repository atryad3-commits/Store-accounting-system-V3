import re

with open('src/services/dataService.ts', 'r', encoding='utf-8') as f:
    code = f.read()

# Update addPerson contacts/bankAccounts
old_add = """  if (contacts && contacts.length > 0) {
      const allContacts = await getLocalData<any[]>('person_contacts', []);
      await saveLocalData('person_contacts', [...allContacts, ...contacts.map((c: any) => ({...c, personId: newPerson.id}))]);
  }
  if (bankAccounts && bankAccounts.length > 0) {
      const allBanks = await getLocalData<any[]>('person_bank_accounts', []);
      await saveLocalData('person_bank_accounts', [...allBanks, ...bankAccounts.map((b: any) => ({...b, personId: newPerson.id}))]);
  }"""
new_add = """  if (contacts && contacts.length > 0) {
      const allContacts = await getLocalData<any[]>('person_contacts', []);
      await saveLocalData('person_contacts', [...allContacts, ...contacts.map((c: any) => ({...c, id: c.id || generateId(), personId: newPerson.id}))]);
  }
  if (bankAccounts && bankAccounts.length > 0) {
      const allBanks = await getLocalData<any[]>('person_bank_accounts', []);
      await saveLocalData('person_bank_accounts', [...allBanks, ...bankAccounts.map((b: any) => ({...b, id: b.id || generateId(), personId: newPerson.id}))]);
  }"""
code = code.replace(old_add, new_add)

# Update updatePerson contacts/bankAccounts
old_upd = """    if (contacts) {
       const allContacts = await getLocalData<any[]>('person_contacts', []);
       const filteredContacts = allContacts.filter(c => String(c.personId) !== String(id));
       await saveLocalData('person_contacts', [...filteredContacts, ...contacts.map((c: any) => ({...c, personId: id}))]);
    }
    if (bankAccounts) {
       const allBanks = await getLocalData<any[]>('person_bank_accounts', []);
       const filteredBanks = allBanks.filter(b => String(b.personId) !== String(id));
       await saveLocalData('person_bank_accounts', [...filteredBanks, ...bankAccounts.map((b: any) => ({...b, personId: id}))]);
    }"""
new_upd = """    if (contacts) {
       const allContacts = await getLocalData<any[]>('person_contacts', []);
       const filteredContacts = allContacts.filter(c => String(c.personId) !== String(id));
       await saveLocalData('person_contacts', [...filteredContacts, ...contacts.map((c: any) => ({...c, id: c.id || generateId(), personId: id}))]);
    }
    if (bankAccounts) {
       const allBanks = await getLocalData<any[]>('person_bank_accounts', []);
       const filteredBanks = allBanks.filter(b => String(b.personId) !== String(id));
       await saveLocalData('person_bank_accounts', [...filteredBanks, ...bankAccounts.map((b: any) => ({...b, id: b.id || generateId(), personId: id}))]);
    }"""
code = code.replace(old_upd, new_upd)

with open('src/services/dataService.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("done")
