const fs = require('fs');
let code = fs.readFileSync('src/components/modals/PersonFormModal.tsx', 'utf8');

// 1. Add states for duplicates, roles, categories
const statesAnchor = `const [newPersonRegistrationNumber, setNewPersonRegistrationNumber] = useState("");`;
const statesInjection = `const [newPersonRegistrationNumber, setNewPersonRegistrationNumber] = useState("");
  const [newPersonRoles, setNewPersonRoles] = useState<string[]>([]);
  const [newPersonCategories, setNewPersonCategories] = useState<string[]>([]);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [showDuplicatesModal, setShowDuplicatesModal] = useState(false);
`;
if(!code.includes('const [duplicates, setDuplicates]')) {
    code = code.replace(statesAnchor, statesInjection);
}

// 2. Add handleCheckDuplicates function
const submitAnchor = `const handleSubmitPerson = async (e?: React.FormEvent) => {`;
const checkDuplicatesCode = `
  const handleCheckDuplicates = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") {
      try { e.preventDefault(); } catch (err) {}
    }
    
    // Check duplicates API
    try {
        const response = await fetch('/api/persons/check-duplicates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newPersonType === "legal" ? newPersonCompanyName : \`\${newPersonFirstName} \${newPersonLastName}\`.trim(),
                nationalId: newPersonNationalId,
                phone: newPersonPhone,
                taxNumber: newPersonEconomicCode,
                registrationNumber: newPersonRegistrationNumber,
                companyName: newPersonCompanyName
            })
        });
        const result = await response.json();
        
        if (result.success && result.duplicates && result.duplicates.length > 0) {
            // Remove the editing person from duplicates if it's edit mode
            const filteredDuplicates = editingPersonId 
               ? result.duplicates.filter((d: any) => d.id !== editingPersonId) 
               : result.duplicates;
               
            if (filteredDuplicates.length > 0) {
                setDuplicates(filteredDuplicates);
                setShowDuplicatesModal(true);
                return; // Stop submission
            }
        }
    } catch (e) {
        console.error("Failed to check duplicates", e);
    }
    
    // Proceed to submit if no duplicates or error
    handleSubmitPerson();
  };

const handleSubmitPerson = async (e?: React.FormEvent) => {`;

if(!code.includes('handleCheckDuplicates')) {
    code = code.replace(submitAnchor, checkDuplicatesCode);
}

fs.writeFileSync('src/components/modals/PersonFormModal.tsx', code);
console.log('Injected duplicate checking into modal.');
