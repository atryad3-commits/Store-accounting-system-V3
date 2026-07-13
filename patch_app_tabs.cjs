const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add import
content = content.replace(
  'import ProductCardModal from "./components/modals/ProductCardModal";',
  'import ProductCardModal from "./components/modals/ProductCardModal";\nimport ProductLastPricesView from "./components/reports/ProductLastPricesView";'
);

// Add to MainContent Tab Type
content = content.replace(
  '| "kardex"',
  '| "kardex"\n    | "product_last_prices"'
);

// Add to switch cases
const caseStr = `
      case "product_last_prices":
        return (
          <ProductLastPricesView
            products={products}
            invoices={invoices}
            formatCurrency={formatCurrency}
            toPersianDigits={toPersianDigits}
            formatDateDisplay={formatDateDisplay}
          />
        );
`;
content = content.replace(
  'case "kardex":',
  caseStr + '\n      case "kardex":'
);

fs.writeFileSync('src/App.tsx', content);
