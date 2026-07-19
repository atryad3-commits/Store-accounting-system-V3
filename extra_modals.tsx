              {/* Invoice Saved Viewer / Print Sheet Modals */}
              
              {/* Check Details Modal */}
              {viewingCheck && (
                <div
                  key="viewing-check-modal"
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/55 backdrop-blur-sm"
                  dir="rtl"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-md"
                  >
                    <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-black text-gray-900">
                            {viewingCheck._type === 'issued' ? 'جزئیات چک پرداختی' : 'جزئیات چک دریافتی'}
                          </h2>
                          <p className="text-xs font-semibold text-gray-500 mt-0.5">
                            شماره چک: {toPersianDigits(viewingCheck.checkNumber)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setViewingCheck(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <span className="block text-[10px] font-bold text-gray-500 mb-1">مبلغ چک</span>
                          <div className="text-sm font-black text-gray-900">
                            {toPersianDigits(formatNumber(viewingCheck.amount))} <span className="text-[10px] text-gray-500 font-bold">{storeSettings?.currency || 'تومان'}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <span className="block text-[10px] font-bold text-gray-500 mb-1">وضعیت فعلی</span>
                          <div className="text-sm font-black text-indigo-700">
                            {viewingCheck.status === 'issued' ? 'در جریان (صادره)' :
                             viewingCheck.status === 'cashed' ? 'پاس شده' :
                             viewingCheck.status === 'bounced' ? 'برگشتی' :
                             viewingCheck.status === 'cancelled' ? 'باطل شده' :
                             viewingCheck.status === 'received' ? 'دریافت شده' :
                             viewingCheck.status === 'deposited' ? 'خوابانده به حساب' :
                             viewingCheck.status === 'assigned' ? 'خرج شده (واگذاری)' :
                             viewingCheck.status === 'bounced_assigned' ? 'برگشتی (خرج شده)' :
                             viewingCheck.status === 'returned' ? 'عودت داده شده' : 'نامشخص'}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <span className="block text-[10px] font-bold text-gray-500 mb-1">تاریخ صدور / دریافت</span>
                          <div className="text-sm font-bold text-gray-900 text-right font-sans">
                            {formatDateDisplay(viewingCheck.issueDate || viewingCheck.receiveDate, storeSettings?.calendarType)}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <span className="block text-[10px] font-bold text-gray-500 mb-1">تاریخ سررسید</span>
                          <div className="text-sm font-bold text-gray-900 text-right font-sans">
                            {formatDateDisplay(viewingCheck.dueDate, storeSettings?.calendarType)}
                          </div>
                        </div>
                      </div>
                      
                      {viewingCheck.description && (
                        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                          <span className="block text-[10px] font-bold text-amber-700 mb-1">بابت / توضیحات</span>
                          <p className="text-sm font-medium text-gray-800 leading-relaxed">
                            {viewingCheck.description}
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (viewingCheck._type === 'issued') setActiveTab('issued_checks');
                            else setActiveTab('received_checks');
                            setViewingCheck(null);
                          }}
                          className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold transition-colors text-sm border border-indigo-200"
                        >
                          مشاهده در بخش مدیریت چک‌ها
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {viewingInvoice && (
                <div
                  key="viewing-invoice-modal"
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/55 backdrop-blur-sm"
                  dir="rtl"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-4xl max-h-[95vh] flex flex-col print-section print:max-h-none print:h-auto print:overflow-visible print:border-none print:shadow-none print:rounded-none"
                  >
                    {/* Header (No print) */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 no-print">
                      <h3 className="text-lg font-black text-indigo-700 flex items-center gap-2">
                        <Printer className="w-5 h-5" />
                        برگه رسمی فاکتور سیستم
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTimeout(() => window.print(), 100);
                          }}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                          چاپ / ذخیره PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewingInvoice(null)}
                          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors border border-gray-100 cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Printable Area */}
                    <div className="p-6 md:p-8 overflow-y-auto flex-1 text-gray-800 text-sm print:overflow-visible print:px-8 print:py-12 bg-gray-50/50 print:bg-white flex justify-center">
                      {viewingInvoice.type?.includes("warehouse") ? (
                        <div
                          className={
                            "bg-white print:p-0 rounded-2xl print:rounded-none overflow-hidden text-slate-800 w-full shadow-sm border border-slate-200 print:shadow-none print:border-none relative flex flex-col font-sans " +
                            (storeSettings?.print_paper_size === "A5"
                              ? "max-w-[148mm] min-h-[210mm]"
                              : storeSettings?.print_paper_size === "receipt80"
                                ? "max-w-[80mm] min-h-[100mm] print:text-xs"
                                : storeSettings?.print_paper_size === "receipt58"
                                  ? "max-w-[58mm] min-h-[100mm] print:text-[10px]"
                                  : "max-w-[210mm] min-h-fit")
                          }
                        >
                          <WarehousePrintTemplate persons={persons}
                            data={viewingInvoice}
                            storeSettings={storeSettings}
                            warehouses={warehouses}
                            products={products}
                          />
                        </div>
                      ) : (
                        <div
                          className={
                            "bg-white print:p-0 rounded-2xl print:rounded-none overflow-hidden text-slate-800 w-full shadow-sm border border-slate-200 print:shadow-none print:border-none relative flex flex-col font-sans " +
                            (storeSettings?.print_paper_size === "A5"
                              ? "max-w-[148mm] min-h-[210mm]"
                              : storeSettings?.print_paper_size === "receipt80"
                                ? "max-w-[80mm] min-h-[100mm] print:text-xs"
                                : storeSettings?.print_paper_size === "receipt58"
                                  ? "max-w-[58mm] min-h-[100mm] print:text-[10px]"
                                  : "max-w-[210mm] min-h-fit")
                          }
                        >
                          <InvoicePrintTemplate persons={persons}
                            data={viewingInvoice}
                            storeSettings={storeSettings}
                           
                            transactions={transactions}
                            invoices={invoices}
                            personOpeningBalances={personOpeningBalances}
                            issuedChecks={issuedChecks}
                            receivedChecks={receivedChecks}
                          />
                        </div>
                      )}
                    </div>

                    {/* Sticky bottom (No print) */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 no-print">
                      {(viewingInvoice.isDraft ||
                        viewingInvoice.status === "draft") && (
                        <button
                          type="button"
                          onClick={() => {
                            setViewingInvoice(null);
                            handleEditInvoiceAction(viewingInvoice);
                          }}
                          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-xs"
                        >
                          <Edit2 className="w-4 h-4" />
                          ویرایش و ثبت نهایی پیش‌نویس
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-xs"
                      >
                        <Printer className="w-4 h-4" />
                        چاپ و پرینت سند
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewingInvoice(null)}
                        className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                      >
                        بستن پیش‌نمایش
                      </button>
                    </div>
                  </motion.div>
                </div>
