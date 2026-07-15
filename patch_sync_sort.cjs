const fs = require('fs');
let code = fs.readFileSync('src/services/dataService.ts', 'utf-8');

const oldSort = `productHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());`;
const newSort = `// Store original insertion index to use as secondary sort (higher index = newer)
  productHistory.forEach((h: any, i: number) => h._index = i);
  
  // Sort by date descending, then by insertion index descending
  productHistory.sort((a: any, b: any) => {
      const timeDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (timeDiff !== 0) return timeDiff;
      return (b._index || 0) - (a._index || 0);
  });`;

if (code.includes(oldSort)) {
    code = code.replace(oldSort, newSort);
    fs.writeFileSync('src/services/dataService.ts', code, 'utf-8');
    console.log('Patched syncProductLatestPrices sorting');
} else {
    console.log('Sort not found');
}
