with open('src/components/modals/PersonFormModal.tsx', 'r') as f:
    content = f.read()

import re

# Find the datalist for real person
pattern = r'<datalist id="aliasOptionsList">.*?</datalist>'
match = re.search(pattern, content, re.DOTALL)
if match:
    old_datalist = match.group(0)
    new_datalist = """<datalist id="aliasOptionsList">
                                          {Array.from(new Set([
                                            `${newPersonTitle} ${newPersonFirstName} ${newPersonLastName}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonTitle} ${newPersonFirstName} ${newPersonLastName} ${newPersonFatherName ? `(فرزند ${newPersonFatherName})` : ''}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonFirstName} ${newPersonLastName}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonFirstName} ${newPersonLastName} ${newPersonFatherName ? `(فرزند ${newPersonFatherName})` : ''}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonTitle} ${newPersonLastName}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonTitle} ${newPersonLastName} ${newPersonFatherName ? `(فرزند ${newPersonFatherName})` : ''}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonLastName}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonLastName} ${newPersonFatherName ? `(فرزند ${newPersonFatherName})` : ''}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonTitle} ${newPersonFirstName}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonFirstName}`.trim().replace(/\\s+/g, ' '),
                                            `${newPersonLastName} ${newPersonFirstName}`.trim().replace(/\\s+/g, ' ')
                                          ].filter(Boolean))).map(opt => (
                                            <option key={opt} value={opt} />
                                          ))}
                                        </datalist>"""
    content = content.replace(old_datalist, new_datalist)
    with open('src/components/modals/PersonFormModal.tsx', 'w') as f:
        f.write(content)
    print("Datalist updated!")
else:
    print("Datalist not found!")
