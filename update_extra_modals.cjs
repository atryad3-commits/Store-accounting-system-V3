const fs = require('fs');
const file = 'src/components/modals/ExtraModals.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add Imports
content = content.replace(
  "const PrintBarcodeModal =",
  "const ProductPriceHistoryModal = React.lazy(() => import('./ProductPriceHistoryModal').catch(() => ({ default: () => null })));\nconst GroupPriceUpdateWizard = React.lazy(() => import('./GroupPriceUpdateWizard').catch(() => ({ default: () => null })));\nconst PrintBarcodeModal ="
);

// Add to props destructing
content = content.replace(
  'isPersonExtraModalOpen, setIsPersonExtraModalOpen,',
  'isPersonExtraModalOpen, setIsPersonExtraModalOpen,\n    historyProductId, setHistoryProductId,\n    invoices, isGroupPriceModalOpen, setIsGroupPriceModalOpen, groupUpdateType, setGroupUpdateType, selectedProductIds, setSelectedProductIds, productCategories, storeSettings,'
);

// Add Modals
const newModals = `
      {historyProductId && (
        <ProductPriceHistoryModal
          isOpen={!!historyProductId}
          onClose={() => { if(props.setHistoryProductId) props.setHistoryProductId(null); }}
          productId={historyProductId}
          products={props.products}
          invoices={invoices}
          formatCurrency={props.formatCurrency}
          toPersianDigits={props.toPersianDigits}
        />
      )}
      {isGroupPriceModalOpen && (
        <GroupPriceUpdateWizard
          products={props.products}
          productCategories={productCategories}
          initialSelectedIds={groupUpdateType === 'selected' ? selectedProductIds : []}
          currency={storeSettings?.currency || "تومان"}
          onClose={() => setIsGroupPriceModalOpen(false)}
          onSave={async (items) => {
            if (props.handleGroupPriceUpdate) {
              await props.handleGroupPriceUpdate(items);
            }
          }}
        />
      )}
`;

content = content.replace(
  '</Suspense>',
  newModals + '\n      </Suspense>'
);

fs.writeFileSync(file, content);
