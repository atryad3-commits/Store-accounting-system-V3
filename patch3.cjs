const fs = require('fs');
let code = fs.readFileSync('src/components/inventory/StocktakingManager.tsx', 'utf-8');

const modalHtml = `
      {isProductModalOpen && (
        <FastProductCreateModal
          onClose={() => setIsProductModalOpen(false)}
          onSuccess={async (newProduct) => {
             const updated = require('../../services/dataService').getProducts;
             updated().then((prods) => {
                 setProducts(prods.filter((pr) => pr.type === 'product' || !pr.type));
                 setIsProductModalOpen(false);
                 setProductSearch('');
                 handleAddProductToCounting(newProduct);
             });
          }}
        />
      )}
`;

if (!code.includes('isProductModalOpen &&')) {
  // Find the last occurrence of `</div>` which is followed by `  );` and `}`
  const lastIndex = code.lastIndexOf('</div>');
  code = code.substring(0, lastIndex) + modalHtml + code.substring(lastIndex);
  fs.writeFileSync('src/components/inventory/StocktakingManager.tsx', code, 'utf-8');
  console.log('patched3 successfully');
}
