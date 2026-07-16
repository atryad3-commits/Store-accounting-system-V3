const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const receiveReceiptCase = `
      case "create_receive_receipt":
        return (
          <ReceiveReceiptModal
            isOpen={true}
            onClose={() => setRawActiveTab("debts_credits")}
            receiptHasDraft={receiptHasDraft}
            restoreReceiptDraft={restoreReceiptDraft}
            discardReceiptDraft={discardReceiptDraft}
            handleSubmitReceipt={handleSubmitReceipt}
            receiptPersonId={receiptPersonId}
            setReceiptPersonId={setReceiptPersonId}
            setIsPersonModalOpen={setIsPersonModalOpen}
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
            receiptCheckNumber={receiptCheckNumber}
            setReceiptCheckNumber={setReceiptCheckNumber}
            receiptCheckDueDate={receiptCheckDueDate}
            setReceiptCheckDueDate={setReceiptCheckDueDate}
            receiptCheckBankName={receiptCheckBankName}
            setReceiptCheckBankName={setReceiptCheckBankName}
            receiptNote={receiptNote}
            setReceiptNote={setReceiptNote}
          />
        );
`;

const payReceiptCase = `
      case "create_pay_receipt":
        return (
          <PayReceiptModal
            isOpen={true}
            onClose={() => setRawActiveTab("debts_credits")}
            receiptHasDraft={receiptHasDraft}
            restoreReceiptDraft={restoreReceiptDraft}
            discardReceiptDraft={discardReceiptDraft}
            handleSubmitReceipt={handleSubmitReceipt}
            receiptPersonId={receiptPersonId}
            setReceiptPersonId={setReceiptPersonId}
            setIsPersonModalOpen={setIsPersonModalOpen}
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
            receiptCheckNumber={receiptCheckNumber}
            setReceiptCheckNumber={setReceiptCheckNumber}
            receiptCheckDueDate={receiptCheckDueDate}
            setReceiptCheckDueDate={setReceiptCheckDueDate}
            receiptCheckBankName={receiptCheckBankName}
            setReceiptCheckBankName={setReceiptCheckBankName}
            receiptNote={receiptNote}
            setReceiptNote={setReceiptNote}
          />
        );
`;

code = code.replace(
  'switch (activeTab) {',
  'switch (activeTab) {' + receiveReceiptCase + payReceiptCase
);

// Delete the global modals from the end of App.tsx
// It starts from <ReceiveReceiptModal and goes down to />
// Let's just find and remove them.
const receiveRegex = /<ReceiveReceiptModal[\s\S]*?\/>/g;
const payRegex = /<PayReceiptModal[\s\S]*?\/>/g;
code = code.replace(receiveRegex, '');
code = code.replace(payRegex, '');


fs.writeFileSync('src/App.tsx', code, 'utf-8');
console.log('Patched App.tsx renderTabContent');
