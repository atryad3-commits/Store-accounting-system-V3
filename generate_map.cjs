const fs = require('fs');
let content = fs.readFileSync('src/components/loans/LoansManager.tsx', 'utf-8');

const regex = /filteredLoans\.map\(loan => \{([\s\S]*?)\n\s*\}\)\n\s*\)/;
const match = content.match(regex);
if (match) {
    console.log("Found match!");
} else {
    console.log("No match found!");
}
