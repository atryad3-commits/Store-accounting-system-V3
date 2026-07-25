const fs = require('fs');
const file = 'src/hooks/useAppController.tsx';
let content = fs.readFileSync(file, 'utf8');

const newFunc = `
  const handleGroupPriceUpdate = async (items: any[]) => {
    try {
      for (const item of items) {
        await updateProduct(item.id.toString(), {
          buyPrice: item.buyPrice,
          price: item.price,
        });
      }
      showNotification(\`قیمت \${items.length} کالا با موفقیت بروزرسانی شد\`, "success");
      setIsGroupPriceModalOpen(false);
      setSelectedProductIds([]);
      await fetchDataSilent();
    } catch (e) {
      console.error(e);
      showNotification("خطا در بروزرسانی گروهی قیمت", "error");
    }
  };

  const handleGenerateBarcodes = async () => {
`;

content = content.replace(
  'const handleGenerateBarcodes = async () => {',
  newFunc
);

content = content.replace(
  'handleEditProduct,',
  'handleEditProduct,\n    handleGroupPriceUpdate,'
);

fs.writeFileSync(file, content);
