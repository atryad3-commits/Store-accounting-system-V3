              {isPersonExtraModalOpen && (
                <div key="isPersonExtraModalOpen-modal"
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
                  dir="rtl"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-lg flex flex-col"
                  >
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Info className="w-5 h-5 text-emerald-500" />
                        ثبت اطلاعات تکمیلی بانکی و یادداشت‌ها
                      </h3>
                      <button
                        onClick={() => setIsPersonExtraModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6">
                      <form
                        id="personExtraForm"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          confirmAction(
                            "آیا از ذخیره اطلاعات بانکی و تکمیلی اطمینان دارید؟",
                            async () => {
                              if (personExtraId) {
                                const existing = persons.find(
                                  (p) => p.id === personExtraId,
                                );
                                if (existing) {
                                  const updated = await updatePerson(
                                    personExtraId as string,
                                    {
                                      ...existing,
                                      bankName: personBankName,
                                      bankAccountNumber: personBankAcc,
                                      cardNumber: personCard,
                                      shebaNumber: personSheba,
                                      additionalNotes: personNotes,
                                    },
                                  );
                                  if (updated) {
                                    setPersons(
                                      (persons || []).map((p, index) =>
                                        p.id === personExtraId ? updated : p,
                                      ),
                                    );
                                  }
                                }
                              }
                              setIsPersonExtraModalOpen(false);
                            },
                          );
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              نام بانک
                            </label>
                            <input
                              type="text"
                              value={personBankName}
                              onChange={(e) =>
                                setPersonBankName(e.target.value)
                              }
                              className="w-full px-4 py-2 border rounded-xl"
                              placeholder="مثال: ملت"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              شماره حساب
                            </label>
                            <input
                              type="text"
                              value={personBankAcc}
                              onChange={(e) => setPersonBankAcc(e.target.value)}
                              className="w-full px-4 py-2 border rounded-xl"
                              dir="ltr"
                              placeholder="123456789"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              شماره کارت
                            </label>
                            <input
                              type="text"
                              value={personCard}
                              onChange={(e) => setPersonCard(e.target.value)}
                              className="w-full px-4 py-2 border rounded-xl"
                              dir="ltr"
                              placeholder="6104-337X-XXXX-XXXX"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              شماره شبا
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-mono">
                                IR
                              </span>
                              <input
                                type="text"
                                value={personSheba}
                                onChange={(e) => setPersonSheba(e.target.value)}
                                className="w-full px-4 py-2 pl-9 border rounded-xl text-left"
                                dir="ltr"
                                placeholder="123456..."
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            یادداشت‌های اضافی اطلاعات شخص (آدرس‌های بیشتر و ...)
                          </label>
                          <textarea
                            value={personNotes}
                            onChange={(e) => setPersonNotes(e.target.value)}
                            className="w-full px-4 py-2 border rounded-xl"
                            rows={3}
                            placeholder="یادداشت و اطلاعات بیشتر خود را وارد کنید..."
                          />
                        </div>
                      </form>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 rounded-b-2xl">
                      <button
                        type="button"
                        onClick={() => setIsPersonExtraModalOpen(false)}
                        className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors text-sm"
                      >
                        انصراف
                      </button>
                      <button
                        form="personExtraForm"
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm text-sm flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        ذخیره اطلاعات تکمیلی
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
              <PersonIOModal isOpen={isPersonIOModalOpen} onClose={() => setIsPersonIOModalOpen(false)} action={personIOAction} setAction={setPersonIOAction} persons={persons} storeSettings={storeSettings} addPerson={addPerson} showNotification={showNotification} confirmAction={confirmAction} getRoleName={getRoleName} fetchPersons={fetchPersons} />
              {isPersonModalOpen && (
                <div key="isPersonModalOpen-modal"
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
                  dir="rtl"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col relative"
                  >
                    {submittingPerson && (
                      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center cursor-wait select-none">
                        <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
                          <RefreshCw className="w-6 h-6 text-indigo-400 animate-pulse" />
                        </div>
                        
                        <h3 className="text-lg font-black text-white mb-2">در حال ثبت اطلاعات شخص...</h3>
                        <p className="text-slate-400 text-xs max-w-xs leading-relaxed mb-6 font-bold">
                          لطفاً منتظر بمانید. اطلاعات شخص و کدهای حسابداری مرتبط با آن به صورت یکپارچه و امن در حال ثبت است.
                        </p>

                        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                          <div className="absolute h-full w-1/2 bg-indigo-500 rounded-full animate-loading-bar"></div>
                        </div>
                      </div>
                    )}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-500" />
                        ثبت شخص جدید
                      </h3>
                      <button
                        onClick={() => setIsPersonModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex border-b border-gray-100 mt-2 px-6">
                      <button
                        type="button"
                        onClick={() => setPersonModalActiveTab("basic")}
                        className={`px-4 py-2 border-b-2 font-bold text-sm transition-colors cursor-pointer ${personModalActiveTab === "basic" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                      >
                        اطلاعات پایه
                      </button>
                      <button
                        type="button"
                        onClick={() => setPersonModalActiveTab("contact")}
                        className={`px-4 py-2 border-b-2 font-bold text-sm transition-colors cursor-pointer ${personModalActiveTab === "contact" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                      >
                        اطلاعات تماس
                      </button>
                      <button
                        type="button"
                        onClick={() => setPersonModalActiveTab("financial")}
                        className={`px-4 py-2 border-b-2 font-bold text-sm transition-colors cursor-pointer ${personModalActiveTab === "financial" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                      >
                        وضعیت مالی اولیه (افتتاحیه)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPersonModalActiveTab("settings")}
                        className={`px-4 py-2 border-b-2 font-bold text-sm transition-colors cursor-pointer ${personModalActiveTab === "settings" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                      >
                        تنظیمات و وضعیت
                      </button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                      <form
                        id="personForm"
                        onSubmit={(e) => {
                          e.preventDefault();
                          confirmAction(
                            "آیا از ثبت اطلاعات شخص اطمینان دارید؟",
                            () => handleSubmitPerson(e as any),
                          );
                        }}
                        className="flex flex-col gap-5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {personModalActiveTab === "basic" && (
                            <>
                              <div className="w-full text-right md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 p-4 rounded-xl border border-slate-100 items-center">
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-white">
                                    {newPersonImage ? (
                                      <img
                                        src={newPersonImage}
                                        alt="Avatar"
