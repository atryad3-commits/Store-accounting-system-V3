const fs = require('fs');
let content = fs.readFileSync('src/components/products/BulkBarcodeGenerator.tsx', 'utf8');

// Replace imports
content = content.replace(
  `import React, { useState, useMemo } from 'react';`,
  `import React, { useState, useMemo } from 'react';\nimport { AlertTriangle } from 'lucide-react';`
);
if (!content.includes('AlertTriangle')) {
    content = content.replace(
      `import { Search, Check, RefreshCw, ArrowRight } from 'lucide-react';`,
      `import { Search, Check, RefreshCw, ArrowRight, AlertTriangle } from 'lucide-react';`
    );
}

// Add EAN-13 to formats
content = content.replace(
  `<option value="numeric_only">عدد تصادفی / سریال</option>`,
  `<option value="numeric_only">عدد تصادفی / سریال</option>\n                  <option value="ean13">EAN-13 (استاندارد جهانی)</option>`
);

content = content.replace(
  `{(barcodeFormat === "prefix_serial" || barcodeFormat === "random_alphanumeric") && (`,
  `{(barcodeFormat === "prefix_serial" || barcodeFormat === "random_alphanumeric" || barcodeFormat === "ean13") && (`
);

content = content.replace(
  `placeholder="مثال: PRD"`,
  `placeholder={barcodeFormat === "ean13" ? "پیشوند (مثال: 626)" : "مثال: PRD"}\n                    maxLength={barcodeFormat === "ean13" ? 11 : undefined}`
);

content = content.replace(
  `{(barcodeFormat === "prefix_serial" || barcodeFormat === "numeric_only") && (`,
  `{(barcodeFormat === "prefix_serial" || barcodeFormat === "numeric_only" || barcodeFormat === "ean13") && (`
);

// Fix generation logic
const handleGenerateMatch = `  const handleGenerate = async () => {
    if (selectedProducts.length === 0) {
       alert("لطفا حداقل یک کالا را انتخاب کنید");
       return;
    }
    
    setGenerating(true);
    let currentNumber = Number(barcodeStartNumber) || 1000;
    let updatedCount = 0;
    const existingBarcodes = new Set((products || []).map((p: any) => p.barcode).filter(Boolean));

    try {
      for (const productId of selectedProducts) {
        const p = products.find((x: any) => x.id === productId);
        if (!p) continue;
        
        let newBarcode = "";
        let attempts = 0;
        do {
          if (barcodeFormat === "prefix_serial") {
            newBarcode = \`\${barcodePrefix}\${String(currentNumber).padStart(Number(barcodeLength), "0")}\`;
            currentNumber++;
          } else if (barcodeFormat === "numeric_only") {
            newBarcode = \`\${String(currentNumber).padStart(Number(barcodeLength), "0")}\`;
            currentNumber++;
          } else if (barcodeFormat === "ean13") {
            const prefix = (barcodePrefix || "626").replace(/[^0-9]/g, '');
            const requiredSerialLength = 12 - prefix.length;
            const serialStr = String(currentNumber).padStart(requiredSerialLength, "0").slice(0, requiredSerialLength);
            const base12 = (prefix + serialStr).padStart(12, "0").slice(0, 12);
            let sum = 0;
            for (let i = 0; i < 12; i++) {
                const digit = parseInt(base12[i], 10);
                sum += (i % 2 === 0) ? digit : digit * 3;
            }
            const remainder = sum % 10;
            const checksum = remainder === 0 ? 0 : 10 - remainder;
            newBarcode = base12 + checksum.toString();
            currentNumber++;
          } else if (barcodeFormat === "random_alphanumeric") {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let result = barcodePrefix;
            for (let i = 0; i < Number(barcodeLength); i++) {
              result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            newBarcode = result;
          } else if (barcodeFormat === "uuid") {
            newBarcode = Math.random().toString(36).substring(2, 10).toUpperCase();
          }
          attempts++;
          if (attempts > 1000) {
             newBarcode += "-" + Math.floor(Math.random() * 1000);
          }
        } while (existingBarcodes.has(newBarcode));
        
        existingBarcodes.add(newBarcode);
        await updateProduct(p.id, { barcode: newBarcode });
        updatedCount++;
      }
      
      alert(\`تعداد \${toPersianDigits(updatedCount)} بارکد با موفقیت تولید و ثبت شد.\`);
      setSelectedProducts([]);
      await fetchProducts();
    } catch (err) {`;

content = content.replace(/  const handleGenerate = async \(\) => {[\s\S]*?} catch \(err\) {/, handleGenerateMatch);

// Compute duplicates
const duplicatesMatch = `  const duplicateBarcodes = useMemo(() => {
    if (!products) return [];
    const counts = new Map();
    products.forEach((p: any) => {
      if (p.barcode && p.barcode.trim() !== '') {
        counts.set(p.barcode, (counts.get(p.barcode) || 0) + 1);
      }
    });
    const dups: {barcode: string, count: number}[] = [];
    counts.forEach((v, k) => {
      if (v > 1) dups.push({ barcode: k, count: v });
    });
    return dups;
  }, [products]);

  const filteredProducts = useMemo(() => {`;
  
content = content.replace(`  const filteredProducts = useMemo(() => {`, duplicatesMatch);

// Render duplicates
const renderMatch = `        <div className="lg:col-span-2 space-y-4">
          {duplicateBarcodes.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-rose-700 font-bold mb-2">
                <AlertTriangle className="w-5 h-5" />
                اخطار: بارکدهای تکراری در سیستم وجود دارد
              </div>
              <p className="text-sm text-rose-600 mb-3">
                کالاهای زیر دارای بارکد یکسان هستند. لطفا در لیست کالاها این موارد را اصلاح کنید:
              </p>
              <div className="max-h-40 overflow-y-auto pr-2 styled-scrollbar">
                <ul className="text-sm text-rose-700 space-y-2 list-disc list-inside font-medium">
                  {duplicateBarcodes.map((d, i) => (
                    <li key={i}>بارکد <span className="font-mono bg-white px-1.5 py-0.5 rounded text-rose-600">{d.barcode}</span> در {toPersianDigits(d.count)} کالا استفاده شده است.</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3">`;

content = content.replace(`        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3">`, renderMatch);


fs.writeFileSync('src/components/products/BulkBarcodeGenerator.tsx', content);
