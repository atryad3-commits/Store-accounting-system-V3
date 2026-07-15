const fs = require('fs');
let code = fs.readFileSync('src/components/modals/ProductCardModal.tsx', 'utf-8');

const oldChartData = `   const chartData = useMemo(() => {
     return priceHistory.reverse().map((h: any) => ({
       ...h,
       salePrice: h.type === 'sale' ? Number(h.price) : null,
       purchasePrice: h.type === 'purchase' ? Number(h.price) : null,
       date: new Date(h.date).toLocaleDateString('fa-IR'),
     }));
   }, [priceHistory]);`;

const newChartData = `   const chartData = useMemo(() => {
     return [...priceHistory].reverse().map((h: any) => ({
       ...h,
       salePrice: h.type === 'sale' ? Number(h.price) : null,
       purchasePrice: h.type === 'purchase' ? Number(h.price) : null,
       date: formatDateDisplay(h.date),
     }));
   }, [priceHistory]);`;

if (code.includes(oldChartData)) {
    code = code.replace(oldChartData, newChartData);
    fs.writeFileSync('src/components/modals/ProductCardModal.tsx', code, 'utf-8');
    console.log('Patched chartData');
} else {
    console.log('Could not find chartData');
}
