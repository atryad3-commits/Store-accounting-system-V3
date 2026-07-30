const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

const routeToInject = `
  app.post('/api/persons/check-duplicates', async (req, res) => {
    try {
       const { name, nationalId, phone, taxNumber, registrationNumber, companyName } = req.body;
       const persons = await getDbData('persons') || [];
       
       const duplicates = persons.filter((p) => {
           let score = 0;
           if (nationalId && p.nationalId && p.nationalId === nationalId) score += 100;
           if (taxNumber && p.taxNumber && p.taxNumber === taxNumber) score += 100;
           if (registrationNumber && p.registrationNumber && p.registrationNumber === registrationNumber) score += 100;
           
           if (phone && p.phone) {
               // strip non-digits
               const ph1 = String(phone).replace(/\\D/g, '');
               const ph2 = String(p.phone).replace(/\\D/g, '');
               if (ph1 && ph1 === ph2) score += 80;
           }
           
           if (name && p.name && typeof p.name === 'string') {
               if (p.name.includes(name) || name.includes(p.name)) score += 50;
           }
           
           if (companyName && p.companyName && typeof p.companyName === 'string') {
               if (p.companyName.includes(companyName) || companyName.includes(p.companyName)) score += 60;
           }

           return score >= 50;
       });

       res.json({ success: true, duplicates: duplicates.slice(0, 5) });
    } catch (err) {
       console.error(err);
       res.status(500).json({ error: err.message });
    }
  });
`;

// Insert it before app.post('/api/data/batch'
if (!server.includes('/api/persons/check-duplicates')) {
    server = server.replace(`app.post('/api/data/batch',`, routeToInject + `\n  app.post('/api/data/batch',`);
    fs.writeFileSync('server.ts', server);
    console.log('Injected check-duplicates route.');
} else {
    console.log('Route already exists.');
}
