const fs = require('fs');
let content = fs.readFileSync('src/components/modals/GenerateBarcodesModal.tsx', 'utf8');

const replacement = `  barcodeStartNumber,
  setBarcodeStartNumber,
  handleGenerateBarcodes,
  products
}: any) {
  const [generating, setGenerating] = useState(false);

  const duplicateBarcodes = useMemo(() => {
    if (!products) return [];
    const barcodeCounts = new Map();
    products.forEach((p) => {
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

content = content.replace(/  barcodeStartNumber,[\s\n]*setBarcodeStartNumber,[\s\n]*handleGenerateBarcodes\s*}: any\) {\s*const \[generating, setGenerating\] = useState\(false\);/, replacement);

fs.writeFileSync('src/components/modals/GenerateBarcodesModal.tsx', content);
