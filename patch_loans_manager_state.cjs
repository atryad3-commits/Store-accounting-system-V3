const fs = require('fs');
let code = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf8');

code = code.replace(
    /const \[isSubmitting, setIsSubmitting\] = useState\(false\);/,
    `const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');`
);

fs.writeFileSync('src/components/loans/LoansManager.tsx', code);
