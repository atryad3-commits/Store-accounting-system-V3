const fs = require('fs');
let content = fs.readFileSync('src/components/modals/PersonFormModal.tsx', 'utf8');

const importTarget = `import { addPerson, updatePerson, deletePerson } from "../../services/dataService";`;
const importReplacement = `import { addPerson, updatePerson, deletePerson } from "../../services/dataService";\nimport { personSchema } from "../../schemas/validation";`;

if (!content.includes('import { personSchema }')) {
  content = content.replace(importTarget, importReplacement);
}

const payloadTarget = `      const payload: any = {`;

const validationTarget = `      if (isEdit) {
        await updatePerson(editingPersonId.toString(), payload);`;

const validationReplacement = `      const validation = personSchema.safeParse(payload);
      if (!validation.success) {
        customAlert(validation.error.errors[0].message);
        setSubmittingPerson(false);
        return;
      }

      if (isEdit) {
        await updatePerson(editingPersonId.toString(), payload);`;

if (!content.includes('personSchema.safeParse')) {
  content = content.replace(validationTarget, validationReplacement);
}

fs.writeFileSync('src/components/modals/PersonFormModal.tsx', content);
console.log("Patched PersonFormModal.tsx with Zod");
