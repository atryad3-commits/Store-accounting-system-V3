if (loading || authLoading) {
    const textStr = authLoading ? "در حال بررسی احراز هویت..." : "در حال بارگذاری اطلاعات و تنظیمات سیستم...";
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden" dir="rtl">
        {/* Background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Animated Logo/Icon */}
          <div className="relative w-24 h-24 mb-8">
            <motion.div
              className="absolute inset-0 border-4 border-indigo-200 rounded-2xl"
              animate={{ rotate: 180, scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-2 border-4 border-blue-400 rounded-xl"
              animate={{ rotate: -180, scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-4 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30"
              animate={{ scale: [1, 0.9, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <LayoutDashboard className="w-6 h-6 text-white" />
            </motion.div>
          </div>

          {/* Loading Text */}
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              نرم‌افزار جامع مدیریت مالی
            </h2>
            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
              <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                 className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"
              />
              <span className="text-sm font-bold text-slate-500">{textStr}</span>
            </div>
          </div>
        </div>

        {/* Decorative progress bar */}
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-slate-100">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </div>
    );
  }

if (requiresInitSetup && user) {
    return (
      <div
        className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-10 pb-10"
        dir="rtl"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden max-w-xl w-full">
          <div className="bg-slate-900 p-10 text-center text-white relative overflow-hidden">
            <h1 className="text-2xl font-black mb-3 relative z-10 tracking-tight">
              خوش آمدید
            </h1>
            <p className="text-slate-300 font-medium relative z-10 text-sm">
              جهت ورود به سیستم، تنظیمات اولیه را تکمیل نمایید
            </p>
          </div>
          <div className="p-8">
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm font-bold flex items-start gap-3 mb-8 border border-amber-100 shadow-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                توجه: <strong>نوع تقویم</strong> و <strong>واحد پولی</strong> پس
                از ثبت برای حفظ یکپارچگی پایگاه داده سیستم{" "}
                <strong>غیرقابل تغییر</strong> خواهند بود.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  نام مجموعه / شرکت
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.storeName}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      storeName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-800 focus:border-slate-800 focus:bg-white transition-colors font-semibold text-slate-900"
                  placeholder="عنوان کسب و کار خود را وارد کنید..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  واحد پولی سیستم
                </label>
                <select
                  value={settingsForm.currency}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      currency: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-800 focus:border-slate-800 focus:bg-white transition-colors font-semibold text-slate-900"
                >
                  <option value="ریال">ریال</option>
                  <option value="تومان">تومان</option>
                  <option value="دلار">دلار (USD)</option>
                  <option value="افغانی">افغانی</option>
                  <option value="درهم">درهم (AED)</option>
                  <option value="یورو">یورو (EUR)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  تاریخ و تقویم سیستم
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setSettingsForm({
                        ...settingsForm,
                        calendarType: "jalali",
                      })
                    }
                    className={`py-4 px-2 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${settingsForm.calendarType !== "gregorian" ? "border-slate-800 bg-slate-800 text-white shadow-sm" : "border-slate-200 text-slate-500 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"}`}
                  >
                    تقویم شمسی (جلالی)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSettingsForm({
                        ...settingsForm,
                        calendarType: "gregorian",
                      })
                    }
                    className={`py-4 px-2 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${settingsForm.calendarType === "gregorian" ? "border-slate-800 bg-slate-800 text-white shadow-sm" : "border-slate-200 text-slate-500 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"}`}
                  >
                    تقویم میلادی
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  فونت سیستم
                </label>
                <select
                  value={settingsForm.fontFamily || "Vazirmatn"}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      fontFamily: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-800 focus:border-slate-800 focus:bg-white transition-colors font-semibold text-slate-900"
                >
                  <option value="Vazirmatn">وزیرمتن (Vazirmatn)</option>
                  <option value="IRANYekanXFaNum">
                    ایران یکان (IRANYekanX)
                  </option>
                  <option value="Lalezar">لاله‌زار (Lalezar)</option>
                  <option value="Readex Pro">ریدکس پرو (Readex Pro)</option>
                  <option value="Cairo">قاهره (Cairo)</option>
                  <option value="Amiri">امیری (Amiri)</option>
                  <option value="Changa">چنگا (Changa)</option>
                  <option value="Tahoma">تاهوما (Tahoma)</option>
                </select>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-2">
                <button
                  type="submit"
                  disabled={submittingSettings}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md active:scale-[0.98] focus:ring-4 focus:ring-slate-100"
                >
                  {submittingSettings ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  ثبت نهایی و ورود به سیستم
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

