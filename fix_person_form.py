import re

with open('src/components/modals/PersonFormModal.tsx', 'r') as f:
    content = f.read()

# 1. Update state type
content = content.replace(
    'useState<"general" | "contact" | "financial">("general");',
    'useState<"general" | "contact" | "financial" | "settings">("general");'
)

# 2. Update button
old_button = """<button
                        type="button"
                        onClick={() => setPersonFormTab("general")}
                        className={`px-4 py-2 border-b-2 font-bold text-sm transition-colors cursor-pointer ${personFormTab === "general" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                      >
                        تنظیمات و وضعیت
                      </button>"""
new_button = """<button
                        type="button"
                        onClick={() => setPersonFormTab("settings")}
                        className={`px-4 py-2 border-b-2 font-bold text-sm transition-colors cursor-pointer ${personFormTab === "settings" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                      >
                        تنظیمات و وضعیت
                      </button>"""
content = content.replace(old_button, new_button)

# 3. Update tab rendering block
# We know the second {personFormTab === "general" && ( is at line ~961. We can replace it by searching for it after financial tab.
pattern_tab = r'(\{personFormTab === "financial".*?\n\s*\}\)\}\s*)\{personFormTab === "general" && \('
match = re.search(pattern_tab, content, re.DOTALL)
if match:
    content = content[:match.end() - len('{personFormTab === "general" && (')] + '{personFormTab === "settings" && (' + content[match.end():]
else:
    print("Could not find the second general tab block")

# 4. Update useEffect for editingPersonId
old_useeffect = """      if (editingPersonId) {
        const person = persons.find(p => p.id === editingPersonId);
        if (person) {
          setNewPersonFirstName(person.name || "");
          setNewPersonRole(person.role || "customer");
          setNewPersonMobile(person.mobile || "");
          setNewPersonType(person.type || "real");
          setNewPersonNationalId(person.nationalId || "");
          setNewPersonCode(person.code || "");
          setNewPersonPhone(person.phone || "");
          setNewPersonPostalCode(person.postalCode || "");
          setNewPersonEmail(person.email || "");
          setNewPersonAddress(person.address || "");
          setNewPersonDescription(person.description || "");
          setNewPersonProvince(person.province || "");
          setNewPersonCity(person.city || "");
          setNewPersonCreditLimit(person.creditLimit ? String(person.creditLimit) : "");
          setNewPersonGroupId(person.groupId || "");
          setNewPersonRoleId(person.roleId || "");
          setNewPersonCompany(person.company || "");
          setNewPersonEconomicCode(person.economicCode || "");
          setNewPersonRegistrationNumber(person.registrationNumber || "");
        }
      } else {"""

new_useeffect = """      if (editingPersonId) {
        const person = persons.find(p => p.id === editingPersonId);
        if (person) {
          setNewPersonFirstName(person.firstName || person.name || "");
          setNewPersonLastName(person.lastName || "");
          setNewPersonTitle(person.title || "");
          setNewPersonFatherName(person.fatherName || "");
          setNewPersonGender(person.gender || "");
          setNewPersonAccountingCode(person.accountingCode || "");
          setNewPersonCompanyName(person.companyName || person.name || "");
          setNewPersonAlias(person.alias || "");
          setNewPersonInitialBalance(person.initialBalance ? String(person.initialBalance) : "");
          setNewPersonInitialBalanceType(person.initialBalanceType || "");
          setNewPersonImage(person.image || "");
          setNewPersonIsActive(person.isActive !== undefined ? person.isActive : true);
          setNewPersonRegistrationDate(person.registrationDate || "");
          
          setNewPersonRole(person.role || "customer");
          setNewPersonMobile(person.mobile || "");
          setNewPersonType(person.type || "real");
          setNewPersonNationalId(person.nationalId || "");
          setNewPersonCode(person.code || "");
          setNewPersonPhone(person.phone || "");
          setNewPersonPostalCode(person.postalCode || "");
          setNewPersonEmail(person.email || "");
          setNewPersonAddress(person.address || "");
          setNewPersonDescription(person.description || "");
          setNewPersonProvince(person.province || "");
          setNewPersonCity(person.city || "");
          setNewPersonCreditLimit(person.creditLimit ? String(person.creditLimit) : "");
          setNewPersonGroupId(person.groupId || "");
          setNewPersonRoleId(person.roleId || "");
          setNewPersonCompany(person.company || "");
          setNewPersonEconomicCode(person.economicCode || "");
          setNewPersonRegistrationNumber(person.registrationNumber || "");
        }
      } else {"""
content = content.replace(old_useeffect, new_useeffect)

# Update reset branch
old_reset = """      } else {
        setNewPersonFirstName("");
        setNewPersonRole("customer");
        setNewPersonMobile("");
        setNewPersonType("real");
        setNewPersonNationalId("");
        setNewPersonCode("");
        setNewPersonPhone("");
        setNewPersonPostalCode("");
        setNewPersonEmail("");
        setNewPersonAddress("");
        setNewPersonDescription("");
        setNewPersonProvince("");
        setNewPersonCity("");
        setNewPersonCreditLimit("");
        setNewPersonGroupId("");
        setNewPersonRoleId("");
        setNewPersonCompany("");
        setNewPersonEconomicCode("");
        setNewPersonRegistrationNumber("");
      }"""

new_reset = """      } else {
        setNewPersonFirstName("");
        setNewPersonLastName("");
        setNewPersonTitle("");
        setNewPersonFatherName("");
        setNewPersonGender("");
        setNewPersonAccountingCode("");
        setNewPersonCompanyName("");
        setNewPersonAlias("");
        setNewPersonInitialBalance("");
        setNewPersonInitialBalanceType("");
        setNewPersonImage("");
        setNewPersonIsActive(true);
        setNewPersonRegistrationDate("");
        
        setNewPersonRole("customer");
        setNewPersonMobile("");
        setNewPersonType("real");
        setNewPersonNationalId("");
        setNewPersonCode("");
        setNewPersonPhone("");
        setNewPersonPostalCode("");
        setNewPersonEmail("");
        setNewPersonAddress("");
        setNewPersonDescription("");
        setNewPersonProvince("");
        setNewPersonCity("");
        setNewPersonCreditLimit("");
        setNewPersonGroupId("");
        setNewPersonRoleId("");
        setNewPersonCompany("");
        setNewPersonEconomicCode("");
        setNewPersonRegistrationNumber("");
      }"""
content = content.replace(old_reset, new_reset)

with open('src/components/modals/PersonFormModal.tsx', 'w') as f:
    f.write(content)

print("Patch applied successfully.")
