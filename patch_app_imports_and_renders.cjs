const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace import
content = content.replace(
  'import ReceiptPaymentForm from "./components/financial/ReceiptPaymentForm";',
  'import ReceiveReceiptModal from "./components/financial/ReceiveReceiptModal";\nimport PayReceiptModal from "./components/financial/PayReceiptModal";'
);

// Add to the render list
const modalRenders = `
      <ReceiveReceiptModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        receiptHasDraft={receiptHasDraft}
        restoreReceiptDraft={restoreReceiptDraft}
        discardReceiptDraft={discardReceiptDraft}
        handleSubmitReceipt={handleSubmitReceipt}
        receiptPersonId={receiptPersonId}
        setReceiptPersonId={setReceiptPersonId}
        persons={persons}
        getPersonDisplayName={getPersonDisplayName}
        receiptMethod={receiptMethod}
        setReceiptMethod={setReceiptMethod}
        accounts={accounts}
        cashboxes={cashboxes}
        receiptAmount={receiptAmount}
        setReceiptAmount={setReceiptAmount}
        receiptDate={receiptDate}
        setReceiptDate={setReceiptDate}
        receiptNumber={receiptNumber}
        receiptCheckNumber={receiptCheckNumber}
        setReceiptCheckNumber={setReceiptCheckNumber}
        receiptCheckDueDate={receiptCheckDueDate}
        setReceiptCheckDueDate={setReceiptCheckDueDate}
        receiptCheckBankName={receiptCheckBankName}
        setReceiptCheckBankName={setReceiptCheckBankName}
        receiptNote={receiptNote}
        setReceiptNote={setReceiptNote}
        formatNumber={formatNumber}
        submittingReceipt={submittingReceipt}
        lastCreatedReceipt={lastCreatedReceipt}
        toPersianDigits={toPersianDigits}
        storeSettings={storeSettings}
        setPrintingTransaction={setPrintingTransaction}
        setLastCreatedReceipt={setLastCreatedReceipt}
        receiptSuccessMsg={receiptSuccessMsg}
        setReceiptLinkedInvoices={setReceiptLinkedInvoices}
        activePersonsOnly={activePersonsOnly}
        mapPersonToOption={mapPersonToOption}
        customPersonFilter={customPersonFilter}
        renderPersonInfoBox={renderPersonInfoBox}
        numToPersianWords={numToPersianWords}
        receiptResourceType={receiptResourceType}
        setReceiptResourceType={setReceiptResourceType}
        receiptResourceId={receiptResourceId}
        setReceiptResourceId={setReceiptResourceId}
        invoices={invoices}
        getDefaultExchangeRate={getDefaultExchangeRate}
        receiptLinkedInvoices={receiptLinkedInvoices}
        formatDateDisplay={formatDateDisplay}
        formatCurrency={formatCurrency}
        customAlert={customAlert}
        receiptCheckbookId={receiptCheckbookId}
        setReceiptCheckbookId={setReceiptCheckbookId}
        checkbooks={checkbooks}
        issuedChecks={issuedChecks}
      />

      <PayReceiptModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        receiptHasDraft={receiptHasDraft}
        restoreReceiptDraft={restoreReceiptDraft}
        discardReceiptDraft={discardReceiptDraft}
        handleSubmitReceipt={handleSubmitReceipt}
        receiptPersonId={receiptPersonId}
        setReceiptPersonId={setReceiptPersonId}
        persons={persons}
        getPersonDisplayName={getPersonDisplayName}
        receiptMethod={receiptMethod}
        setReceiptMethod={setReceiptMethod}
        accounts={accounts}
        cashboxes={cashboxes}
        receiptAmount={receiptAmount}
        setReceiptAmount={setReceiptAmount}
        receiptDate={receiptDate}
        setReceiptDate={setReceiptDate}
        receiptNumber={receiptNumber}
        receiptCheckNumber={receiptCheckNumber}
        setReceiptCheckNumber={setReceiptCheckNumber}
        receiptCheckDueDate={receiptCheckDueDate}
        setReceiptCheckDueDate={setReceiptCheckDueDate}
        receiptCheckBankName={receiptCheckBankName}
        setReceiptCheckBankName={setReceiptCheckBankName}
        receiptNote={receiptNote}
        setReceiptNote={setReceiptNote}
        formatNumber={formatNumber}
        submittingReceipt={submittingReceipt}
        lastCreatedReceipt={lastCreatedReceipt}
        toPersianDigits={toPersianDigits}
        storeSettings={storeSettings}
        setPrintingTransaction={setPrintingTransaction}
        setLastCreatedReceipt={setLastCreatedReceipt}
        receiptSuccessMsg={receiptSuccessMsg}
        setReceiptLinkedInvoices={setReceiptLinkedInvoices}
        activePersonsOnly={activePersonsOnly}
        mapPersonToOption={mapPersonToOption}
        customPersonFilter={customPersonFilter}
        renderPersonInfoBox={renderPersonInfoBox}
        numToPersianWords={numToPersianWords}
        receiptResourceType={receiptResourceType}
        setReceiptResourceType={setReceiptResourceType}
        receiptResourceId={receiptResourceId}
        setReceiptResourceId={setReceiptResourceId}
        invoices={invoices}
        getDefaultExchangeRate={getDefaultExchangeRate}
        receiptLinkedInvoices={receiptLinkedInvoices}
        formatDateDisplay={formatDateDisplay}
        formatCurrency={formatCurrency}
        customAlert={customAlert}
        receiptCheckbookId={receiptCheckbookId}
        setReceiptCheckbookId={setReceiptCheckbookId}
        checkbooks={checkbooks}
        issuedChecks={issuedChecks}
      />
`;

// Insert modal renders just before the <AnimatePresence> that handles viewingPayslip, inside main
content = content.replace(
  '<AnimatePresence>\n              {viewingPayslip && (',
  modalRenders + '\n              <AnimatePresence>\n              {viewingPayslip && ('
);

fs.writeFileSync('src/App.tsx', content);
