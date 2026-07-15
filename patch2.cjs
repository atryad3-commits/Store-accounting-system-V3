const fs = require('fs');
let code = fs.readFileSync('src/components/inventory/StocktakingManager.tsx', 'utf-8');

const modalHtml = `
      {isProductModalOpen && (
        <FastProductCreateModal
          onClose={() => setIsProductModalOpen(false)}
          onSuccess={async (newProduct) => {
             const updated = await getProducts();
             setProducts(updated.filter((pr: any) => pr.type === 'product' || !pr.type));
             setIsProductModalOpen(false);
             setProductSearch('');
             handleAddProductToCounting(newProduct);
          }}
        />
      )}
    </div>
  );
}
`;

code = code.replace(/<\/div>\s*<\/div>\s*\)\s*\}\s*$/g, "</div>" + modalHtml);
if (code.includes('FastProductCreateModal')) {
    fs.writeFileSync('src/components/inventory/StocktakingManager.tsx', code, 'utf-8');
    console.log('patched2');
} else {
    console.log('regex missed');
}
