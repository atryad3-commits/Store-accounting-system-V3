const fs = require('fs');
let content = fs.readFileSync('src/components/modals/ProductFormModal.tsx', 'utf8');

const importTarget = `import CustomDatePicker from "../ui/CustomDatePicker";`;
const importReplacement = `import CustomDatePicker from "../ui/CustomDatePicker";\nimport { productSchema } from "../../schemas/validation";`;

if (!content.includes('import { productSchema }')) {
  content = content.replace(importTarget, importReplacement);
}

const payloadTarget = `      const payload = {
        name: newProductName,`;

const payloadReplacement = `      const payload = {
        name: newProductName,`;

const validationTarget = `      if (isEdit) {
        await updateProduct(editingProductId.toString(), payload);`;

const validationReplacement = `      const validation = productSchema.safeParse(payload);
      if (!validation.success) {
        customAlert(validation.error.errors[0].message);
        setSubmittingProduct(false);
        return;
      }

      if (isEdit) {
        await updateProduct(editingProductId.toString(), payload);`;

if (!content.includes('productSchema.safeParse')) {
  content = content.replace(validationTarget, validationReplacement);
}

fs.writeFileSync('src/components/modals/ProductFormModal.tsx', content);
console.log("Patched ProductFormModal.tsx with Zod");
