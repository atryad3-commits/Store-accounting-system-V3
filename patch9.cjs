const fs = require('fs');
let content = fs.readFileSync('src/components/products/BulkBarcodeGenerator.tsx', 'utf8');

// Also need to import useMemo and AlertTriangle
content = content.replace(
  `import React, { useState, useEffect } from "react";`,
  `import React, { useState, useEffect, useMemo } from "react";`
);
content = content.replace(
  `import { Check, Package, Search, Filter, RefreshCw, Printer, AlertCircle, Settings } from "lucide-react";`,
  `import { Check, Package, Search, Filter, RefreshCw, Printer, AlertCircle, Settings, AlertTriangle } from "lucide-react";`
);

const duplicatesDef = `
  const duplicateBarcodes = useMemo(() => {
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
`;

content = content.replace(
  `const [generating, setGenerating] = useState(false);`,
  `const [generating, setGenerating] = useState(false);\n${duplicatesDef}`
);

fs.writeFileSync('src/components/products/BulkBarcodeGenerator.tsx', content);
