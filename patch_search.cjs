const fs = require('fs');
let content = fs.readFileSync('src/components/WelcomePage.tsx', 'utf8');

content = content.replace(
  `const data = await res.json();
      if (data.success && data.products) {
        const q = searchQuery.toLowerCase();
        const results = data.products.filter((p: any) => `,
  `const data = await res.json();
      if (Array.isArray(data)) {
        const q = searchQuery.toLowerCase();
        const results = data.filter((p: any) => `
);

fs.writeFileSync('src/components/WelcomePage.tsx', content);
