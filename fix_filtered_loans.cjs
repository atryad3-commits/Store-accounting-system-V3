const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

const filterLogic = `
  const filteredLoans = loans.filter(loan => {
    const matchesSearch = getPersonName(loan.personId).toLowerCase().includes(searchQuery.toLowerCase()) || loan.id.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
`;

code = code.replace("  return (", filterLogic);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
