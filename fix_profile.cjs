const fs = require('fs');
let code = fs.readFileSync('src/components/persons/PersonProfileView.tsx', 'utf-8');

const targetStr = `          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              آخرین فاکتورها
            </h3>`;

const trackingComponent = `
          {/* CRM Follow Ups */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm md:col-span-3">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              گزارش پیگیری (CRM)
            </h3>
            <div className="space-y-4">
              {(() => {
                const [followUpData, setFollowUpData] = React.useState<any>(null);
                const [isLoading, setIsLoading] = React.useState(true);
                
                React.useEffect(() => {
                  let isMounted = true;
                  const loadFollowUps = async () => {
                    try {
                      setIsLoading(true);
                      const data = await getPersonFollowUps();
                      if (isMounted) {
                        const personData = data.find((d: any) => String(d.personId) === String(personId));
                        setFollowUpData(personData || null);
                      }
                    } catch (e) {
                      console.error("Error loading followups:", e);
                    } finally {
                      if (isMounted) setIsLoading(false);
                    }
                  };
                  loadFollowUps();
                  return () => { isMounted = false; };
                }, [personId]);

                if (isLoading) {
                  return <div className="text-center py-6 text-slate-400 font-bold text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">در حال بارگذاری اطلاعات پیگیری...</div>;
                }

                if (!followUpData) {
                  return <div className="text-center py-6 text-slate-400 font-bold text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">سابقه پیگیری برای این شخص ثبت نشده است.</div>;
                }

                return (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-bold text-slate-600">وضعیت فعلی:</span>
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                        {followUpData.status}
                      </span>
                      {followUpData.nextActionDate && (
                        <span className="flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">
                          <Calendar className="w-4 h-4" />
                          اقدام بعدی: {storeSettings?.calendarType === 'gregorian' ? new Date(followUpData.nextActionDate).toLocaleDateString('en-US') : new Date(followUpData.nextActionDate).toLocaleDateString('fa-IR')}
                        </span>
                      )}
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mt-4">
                      <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" /> تاریخچه یادداشت‌ها
                      </h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {!followUpData.notes || followUpData.notes.length === 0 ? (
                          <div className="text-xs text-slate-500 text-center py-3">یادداشتی ثبت نشده است</div>
                        ) : (
                          [...followUpData.notes].reverse().map((note: any, idx: number) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 relative">
                              <span className="absolute left-3 top-3 text-[10px] text-slate-400 font-sans">
                                {storeSettings?.calendarType === 'gregorian' ? new Date(note.date).toLocaleDateString('en-US') : new Date(note.date).toLocaleDateString('fa-IR')}
                              </span>
                              <p className="text-xs text-slate-700 leading-relaxed pl-16 whitespace-pre-wrap">{note.text}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
`;

code = code.replace(targetStr, trackingComponent + '\n' + targetStr);
fs.writeFileSync('src/components/persons/PersonProfileView.tsx', code, 'utf-8');
console.log('Done');
