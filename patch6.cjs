const fs = require('fs');
let content = fs.readFileSync('src/components/modals/GenerateBarcodesModal.tsx', 'utf8');

const importReplacement = `import React, { useState, useMemo } from "react";
import { X, Check, AlertTriangle } from "lucide-react";`;
content = content.replace(`import React, { useState } from "react";\nimport { X, Check } from "lucide-react";`, importReplacement);

const propsReplacement = `  barcodeStartNumber,
  setBarcodeStartNumber,
  handleGenerateBarcodes,
  products
}: any) {
  const [generating, setGenerating] = useState(false);

  const duplicateBarcodes = useMemo(() => {
    if (!products) return [];
    const barcodeCounts = new Map();
    products.forEach((p: any) => {
      if (p.barcode && p.barcode.trim() !== "") {
        barcodeCounts.set(p.barcode, (barcodeCounts.get(p.barcode) || 0) + 1);
      }
    });
    const duplicates = [];
    barcodeCounts.forEach((count, barcode) => {
      if (count > 1) duplicates.push({ barcode, count });
    });
    return duplicates;
  }, [products]);
`;
content = content.replace(`  barcodeStartNumber,
  setBarcodeStartNumber,
  handleGenerateBarcodes
}: any) {
  const [generating, setGenerating] = useState(false);`, propsReplacement);


const duplicateUI = `        <div className="p-6 space-y-4">
          {duplicateBarcodes.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-rose-700 font-bold mb-2">
                <AlertTriangle className="w-5 h-5" />
                خطا: بارکدهای تکراری یافت شد
              </div>
              <p className="text-sm text-rose-600 mb-2">
                برخی کالاها دارای بارکد یکسان هستند. لطفا قبل از تولید بارکد جدید این موارد را در لیست کالاها اصلاح کنید:
              </p>
              <ul className="text-xs text-rose-600 space-y-1 list-disc list-inside max-h-32 overflow-y-auto pr-2 styled-scrollbar">
                {duplicateBarcodes.map((d, i) => (
                  <li key={i}>بارکد <strong>{d.barcode}</strong> در {d.count} کالا تکرار شده است.</li>
                ))}
              </ul>
            </div>
          )}
          <div>
`;
content = content.replace(`        <div className="p-6 space-y-4">
          <div>`, duplicateUI);

fs.writeFileSync('src/components/modals/GenerateBarcodesModal.tsx', content);
