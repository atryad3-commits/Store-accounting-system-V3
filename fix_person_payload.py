import re

with open('src/components/modals/PersonFormModal.tsx', 'r') as f:
    content = f.read()

old_payload = """      const payload = {
        type: newPersonRole, // Firebase db maps roles to type
        name: name,
        fullName: name,
        title: newPersonTitle,
        alias: generatedAlias,
        personType: newPersonType,
        firstName: newPersonFirstName,
        lastName: newPersonLastName,
        companyName: newPersonCompanyName,
        fatherName: newPersonFatherName,
        nationalId: newPersonNationalId,
        gender: newPersonGender,
        accountingCode: newPersonAccountingCode,
        address: newPersonAddress,
        imageUrl: newPersonImage,
        role: newPersonRole,
        phone: newPersonPhone,
        contacts: newPersonContacts,
        initialBalance: Number(newPersonInitialBalance || 0),
        initialBalanceType: newPersonInitialBalanceType,
        creditLimit: Number(newPersonCreditLimit || 0),
        group: newPersonGroup,
        province: newPersonProvince,
        city: newPersonCity,
        isActive: newPersonIsActive,
        registrationDate:
          typeof newPersonRegistrationDate.toDate === "function"
            ? newPersonRegistrationDate.toDate().toISOString()
            : new Date(newPersonRegistrationDate).toISOString(),
      };"""

new_payload = """      const payload = {
        type: newPersonRole, // Firebase db maps roles to type
        name: name,
        fullName: name,
        title: newPersonTitle,
        alias: generatedAlias,
        personType: newPersonType,
        firstName: newPersonFirstName,
        lastName: newPersonLastName,
        companyName: newPersonCompanyName,
        fatherName: newPersonFatherName,
        nationalId: newPersonNationalId,
        gender: newPersonGender,
        accountingCode: newPersonAccountingCode,
        address: newPersonAddress,
        imageUrl: newPersonImage,
        role: newPersonRole,
        phone: newPersonPhone,
        mobile: newPersonMobile,
        code: newPersonCode,
        postalCode: newPersonPostalCode,
        email: newPersonEmail,
        description: newPersonDescription,
        groupId: newPersonGroupId,
        roleId: newPersonRoleId,
        company: newPersonCompany,
        economicCode: newPersonEconomicCode,
        registrationNumber: newPersonRegistrationNumber,
        contacts: newPersonContacts,
        initialBalance: Number(newPersonInitialBalance || 0),
        initialBalanceType: newPersonInitialBalanceType,
        creditLimit: Number(newPersonCreditLimit || 0),
        group: newPersonGroup,
        province: newPersonProvince,
        city: newPersonCity,
        isActive: newPersonIsActive,
        registrationDate: newPersonRegistrationDate ? (
          typeof newPersonRegistrationDate.toDate === "function"
            ? newPersonRegistrationDate.toDate().toISOString()
            : new Date(newPersonRegistrationDate).toISOString()
        ) : new Date().toISOString(),
      };"""

if old_payload in content:
    content = content.replace(old_payload, new_payload)
    with open('src/components/modals/PersonFormModal.tsx', 'w') as f:
        f.write(content)
    print("Payload replaced successfully!")
else:
    print("Old payload not found! I will use regex.")
    
