const fs = require('fs');
let code = fs.readFileSync('src/hooks/useAppController.tsx', 'utf8');

const anchor = `const [newPersonCreditLimit, setNewPersonCreditLimit] = useState("");`;
const injection = `const [newPersonCreditLimit, setNewPersonCreditLimit] = useState("");
  const [newPersonTaxNumber, setNewPersonTaxNumber] = useState("");
  const [newPersonRegistrationNumber, setNewPersonRegistrationNumber] = useState("");
  const [newPersonRoles, setNewPersonRoles] = useState<string[]>([]);
  const [newPersonCategories, setNewPersonCategories] = useState<string[]>([]);
  const [duplicatePersonsWarning, setDuplicatePersonsWarning] = useState<any[]>([]);
  `;

if(!code.includes('newPersonTaxNumber')) {
  code = code.replace(anchor, injection);
  fs.writeFileSync('src/hooks/useAppController.tsx', code);
  console.log('Injected states.');
} else {
  console.log('Already injected.');
}
