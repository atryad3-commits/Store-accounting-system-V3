const fs = require('fs');
let code = fs.readFileSync('src/components/modals/ProductCardModal.tsx', 'utf-8');

const oldState = `  const [currentSalePrice, setCurrentSalePrice] = useState(product.price || 0);`;
const newState = `  const [currentSalePrice, setCurrentSalePrice] = useState(product.price || 0);
  const [lastSaleDate, setLastSaleDate] = useState<string>('');
  const [lastPurchaseDate, setLastPurchaseDate] = useState<string>('');`;

const oldEffect = `    if (salePrices.length > 0) setCurrentSalePrice(salePrices[0].price);
    if (purchasePrices.length > 0) setCurrentPurchasePrice(purchasePrices[0].price);`;
const newEffect = `    if (salePrices.length > 0) {
      setCurrentSalePrice(salePrices[0].price);
      setLastSaleDate(salePrices[0].date);
    }
    if (purchasePrices.length > 0) {
      setCurrentPurchasePrice(purchasePrices[0].price);
      setLastPurchaseDate(purchasePrices[0].date);
    }`;

const oldRenderSale = `<span className="text-lg font-sans font-black text-gray-800">{Number(currentSalePrice).toLocaleString()} <span className="text-xs font-normal">{currency}</span></span>`;
const newRenderSale = `<span className="text-lg font-sans font-black text-gray-800">{Number(currentSalePrice).toLocaleString()} <span className="text-xs font-normal">{currency}</span></span>
                     {lastSaleDate && <span className="text-[10px] text-emerald-700 mt-1">آخرین تغییر: {formatDateDisplay(lastSaleDate)}</span>}`;

const oldRenderPurchase = `<span className="text-lg font-sans font-black text-gray-800">{Number(currentPurchasePrice).toLocaleString()} <span className="text-xs font-normal">{currency}</span></span>`;
const newRenderPurchase = `<span className="text-lg font-sans font-black text-gray-800">{Number(currentPurchasePrice).toLocaleString()} <span className="text-xs font-normal">{currency}</span></span>
                     {lastPurchaseDate && <span className="text-[10px] text-rose-700 mt-1">آخرین تغییر: {formatDateDisplay(lastPurchaseDate)}</span>}`;

if (code.includes(oldState)) {
    code = code.replace(oldState, newState);
    code = code.replace(oldEffect, newEffect);
    code = code.replace(oldRenderSale, newRenderSale);
    code = code.replace(oldRenderPurchase, newRenderPurchase);
    fs.writeFileSync('src/components/modals/ProductCardModal.tsx', code, 'utf-8');
    console.log('Patched ProductCardModal');
} else {
    console.log('Could not find hooks in ProductCardModal');
}
