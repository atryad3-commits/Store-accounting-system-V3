import React, { Suspense } from 'react';

const ChangelogModal = React.lazy(() => import('../ChangelogModal').catch(() => ({ default: () => null })));
const ReceiveReceiptModal = React.lazy(() => import('../financial/ReceiveReceiptModal').catch(() => ({ default: () => null })));
const PayReceiptModal = React.lazy(() => import('../financial/PayReceiptModal').catch(() => ({ default: () => null })));
const MinimalMobilePersonModal = React.lazy(() => import('./MinimalMobilePersonModal').catch(() => ({ default: () => null })));
const ProductPriceChangeModal = React.lazy(() => import('./ProductPriceChangeModal').catch(() => ({ default: () => null })));
const PrintBarcodeModal = React.lazy(() => import('./PrintBarcodeModal').catch(() => ({ default: () => null })));
const BarcodeScannerModal = React.lazy(() => import('./BarcodeScannerModal').catch(() => ({ default: () => null })));
const EditReceiptModal = React.lazy(() => import('./EditReceiptModal').catch(() => ({ default: () => null })));
const AIProductSearchModal = React.lazy(() => import('../products/AIProductSearchModal').catch(() => ({ default: () => null })));
const GenerateBarcodesModal = React.lazy(() => import('./GenerateBarcodesModal').catch(() => ({ default: () => null })));

export default function ExtraModals(props: any) {
  const {
    isChangelogModalOpen, setIsChangelogModalOpen,
    isReceiveReceiptModalOpen, setIsReceiveReceiptModalOpen,
    isPayReceiptModalOpen, setIsPayReceiptModalOpen,
    isMinimalPersonModalOpen, setIsMinimalPersonModalOpen,
    isProductPriceChangeModalOpen, setIsProductPriceChangeModalOpen,
    isPrintBarcodeModalOpen, setIsPrintBarcodeModalOpen,
    isBarcodeScannerModalOpen, setIsBarcodeScannerModalOpen,
    isEditReceiptModalOpen, setIsEditReceiptModalOpen,
    isAIProductSearchModalOpen, setIsAIProductSearchModalOpen,
    isGenerateBarcodesModalOpen, setIsGenerateBarcodesModalOpen,
    barcodeFormat, setBarcodeFormat, barcodePrefix, setBarcodePrefix, barcodeLength, setBarcodeLength, handleGenerateBarcodes,
    
    // Other props for modals
    receiptPersonId, setReceiptPersonId,
    receiptInvoiceId, setReceiptInvoiceId,
    receiptAmount, setReceiptAmount,
    receiptMethod, setReceiptMethod,
    receiptDate, setReceiptDate,
    receiptCheckNumber, setReceiptCheckNumber,
    receiptCheckDueDate, setReceiptCheckDueDate,
    receiptCheckBankName, setReceiptCheckBankName,
    receiptCheckbookId, setReceiptCheckbookId,
    receiptNote, setReceiptNote,
    submittingReceipt, handleReceiptSubmit,
    persons, formatCurrency, toPersianDigits, numToPersianWords,
    accounts, cashboxes, checkbooks, storeSettings, confirmAction,
    editingReceipt, updateTransaction, showNotification,
    editingProductId, products, saveProductData, fetchProducts,
    handleBarcodeScan,
    handleAIAssist
  } = props;

  return (
    <Suspense fallback={null}>
      {isChangelogModalOpen && (
        <ChangelogModal isOpen={isChangelogModalOpen} onClose={() => setIsChangelogModalOpen(false)} />
      )}
      
      {isReceiveReceiptModalOpen && (
        <ReceiveReceiptModal
          isOpen={isReceiveReceiptModalOpen}
          onClose={() => setIsReceiveReceiptModalOpen(false)}
          personId={receiptPersonId}
          setPersonId={setReceiptPersonId}
          invoiceId={receiptInvoiceId}
          amount={receiptAmount}
          setAmount={setReceiptAmount}
          method={receiptMethod}
          setMethod={setReceiptMethod}
          date={receiptDate}
          setDate={setReceiptDate}
          checkNumber={receiptCheckNumber}
          setCheckNumber={setReceiptCheckNumber}
          checkDueDate={receiptCheckDueDate}
          setCheckDueDate={setReceiptCheckDueDate}
          checkBankName={receiptCheckBankName}
          setCheckBankName={setReceiptCheckBankName}
          note={receiptNote}
          setNote={setReceiptNote}
          onSubmit={handleReceiptSubmit}
          submitting={submittingReceipt}
          persons={persons}
          formatCurrency={formatCurrency}
          toPersianDigits={toPersianDigits}
          numToPersianWords={numToPersianWords}
          accounts={accounts}
          cashboxes={cashboxes}
          storeSettings={storeSettings}
        />
      )}

      {isPayReceiptModalOpen && (
        <PayReceiptModal
          isOpen={isPayReceiptModalOpen}
          onClose={() => setIsPayReceiptModalOpen(false)}
          personId={receiptPersonId}
          setPersonId={setReceiptPersonId}
          invoiceId={receiptInvoiceId}
          amount={receiptAmount}
          setAmount={setReceiptAmount}
          method={receiptMethod}
          setMethod={setReceiptMethod}
          date={receiptDate}
          setDate={setReceiptDate}
          checkNumber={receiptCheckNumber}
          setCheckNumber={setReceiptCheckNumber}
          checkDueDate={receiptCheckDueDate}
          setCheckDueDate={setReceiptCheckDueDate}
          checkbookId={receiptCheckbookId}
          setCheckbookId={setReceiptCheckbookId}
          note={receiptNote}
          setNote={setReceiptNote}
          onSubmit={handleReceiptSubmit}
          submitting={submittingReceipt}
          persons={persons}
          formatCurrency={formatCurrency}
          toPersianDigits={toPersianDigits}
          numToPersianWords={numToPersianWords}
          accounts={accounts}
          cashboxes={cashboxes}
          checkbooks={checkbooks}
          storeSettings={storeSettings}
        />
      )}

      {isMinimalPersonModalOpen && (
        <MinimalMobilePersonModal
          isOpen={isMinimalPersonModalOpen}
          onClose={() => setIsMinimalPersonModalOpen(false)}
          onSuccess={() => setIsMinimalPersonModalOpen(false)}
        />
      )}

      {isProductPriceChangeModalOpen && editingProductId && (
        <ProductPriceChangeModal
          isOpen={isProductPriceChangeModalOpen}
          onClose={() => {
            setIsProductPriceChangeModalOpen(false);
          }}
          product={products.find((p: any) => p.id === editingProductId)}
          onSave={async (newPrice) => {
            const product = products.find((p: any) => p.id === editingProductId);
            if (product) {
              await saveProductData({ ...product, price: newPrice });
              await fetchProducts();
              setIsProductPriceChangeModalOpen(false);
              showNotification("قیمت محصول با موفقیت بروزرسانی شد", "success");
            }
          }}
          formatCurrency={formatCurrency}
        />
      )}

      {isPrintBarcodeModalOpen && editingProductId && (
        <PrintBarcodeModal
          isOpen={isPrintBarcodeModalOpen}
          onClose={() => setIsPrintBarcodeModalOpen(false)}
          product={products.find((p: any) => p.id === editingProductId)}
        />
      )}

      {isBarcodeScannerModalOpen && (
        <BarcodeScannerModal
          isOpen={isBarcodeScannerModalOpen}
          onClose={() => setIsBarcodeScannerModalOpen(false)}
          onScan={handleBarcodeScan}
        />
      )}

      {isEditReceiptModalOpen && editingReceipt && (
        <EditReceiptModal
          isOpen={isEditReceiptModalOpen}
          onClose={() => setIsEditReceiptModalOpen(false)}
          transaction={editingReceipt}
          persons={persons}
          accounts={accounts}
          cashboxes={cashboxes}
          checkbooks={checkbooks}
          onUpdate={async (data: any) => {
             await updateTransaction(data);
             setIsEditReceiptModalOpen(false);
          }}
        />
      )}

      {isAIProductSearchModalOpen && (
        <AIProductSearchModal
          isOpen={isAIProductSearchModalOpen}
          onClose={() => setIsAIProductSearchModalOpen(false)}
          onConfirm={(results) => {
            if (handleAIAssist) handleAIAssist(results);
            setIsAIProductSearchModalOpen(false);
          }}
          products={products}
        />
      )}
      {isGenerateBarcodesModalOpen && (
        <GenerateBarcodesModal
          isOpen={isGenerateBarcodesModalOpen}
          onClose={() => setIsGenerateBarcodesModalOpen(false)}
          barcodeFormat={barcodeFormat}
          setBarcodeFormat={setBarcodeFormat}
          barcodePrefix={barcodePrefix}
          setBarcodePrefix={setBarcodePrefix}
          barcodeLength={barcodeLength}
          setBarcodeLength={setBarcodeLength}
          handleGenerateBarcodes={async () => {
            await handleGenerateBarcodes();
            setIsGenerateBarcodesModalOpen(false);
          }}
        />
      )}
    </Suspense>
  );
}
