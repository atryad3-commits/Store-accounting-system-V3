import { readFileSync } from 'fs';
import path from 'path';

function checkDuplicates() {
  const dbPath = path.join(process.cwd(), 'database.json');
  try {
    const data = JSON.parse(readFileSync(dbPath, 'utf8'));
    const products = data.products || [];
    const barcodeMap = new Map<string, any[]>();
    
    for (const p of products) {
       if (p.barcode && p.barcode.trim() !== '') {
          const b = p.barcode.trim();
          if (!barcodeMap.has(b)) barcodeMap.set(b, []);
          barcodeMap.get(b)!.push(p);
       }
    }
    
    let hasDup = false;
    console.log("--- Duplicate Barcode Report ---");
    barcodeMap.forEach((items, barcode) => {
       if (items.length > 1) {
          hasDup = true;
          console.log(`\nBarcode: ${barcode} is duplicated in ${items.length} products:`);
          items.forEach(i => console.log(` - [ID: ${i.id}] ${i.name}`));
       }
    });
    
    if (!hasDup) {
      console.log("No duplicate barcodes found.");
    }
  } catch (e) {
    console.error("Failed to read database:", e);
  }
}

checkDuplicates();
