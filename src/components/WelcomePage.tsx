import React, { useState, useEffect } from 'react';
import { LogIn, ArrowLeft, BookOpen, Bell, Activity, Newspaper, ChevronLeft, ShieldCheck, Search, Database, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { toPersianDigits } from '../utils/format';

export default function WelcomePage({ onLoginClick }: { onLoginClick: () => void }) {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await fetch('/api/databases');
        const data = await res.json();
        if (data.success && data.databases) {
          setBusinesses(data.databases);
        }
      } catch (e) {
        console.error("Failed to fetch businesses", e);
      }
    };
    fetchBusinesses();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness || !searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch('/api/data/products', {
        headers: {
          'x-store-id': selectedBusiness
        }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const q = searchQuery.toLowerCase();
        const results = data.filter((p: any) => 
          p.name?.toLowerCase().includes(q) || 
          p.barcode?.includes(q) || 
          p.code?.includes(q)
        );
        setSearchResults(results.slice(0, 10)); // max 10 results
      }
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setIsSearching(false);
    }
  };

  const news = [
    {
      id: 1,
      title: "نسخه جدید سیستم با قابلیت‌های هوش مصنوعی منتشر شد",
      date: "۱۴۰۲/۰۸/۱۵",
      summary: "در این نسخه، امکانات بی‌نظیری از جمله تحلیل‌گر هوشمند بازار، چت‌بات پشتیبانی و گزارش‌ساز پویا اضافه شده است. همچنین سرعت پردازش داده‌ها تا ۴۰ درصد بهبود یافته است.",
      category: "بروزرسانی سیستم"
    },
    {
      id: 2,
      title: "وبینار آموزشی رایگان: آشنایی با ترفندهای حسابداری مدرن",
      date: "۱۴۰۲/۰۸/۱۰",
      summary: "از تمامی کاربران دعوت می‌شود تا در این وبینار رایگان که با حضور اساتید برجسته حسابداری برگزار می‌شود، شرکت نمایند. لینک ورود به زودی ایمیل خواهد شد.",
      category: "آموزش"
    },
    {
      id: 3,
      title: "تغییرات جدید در قوانین مالیاتی و نحوه اعمال آن در سیستم",
      date: "۱۴۰۲/۰۸/۰۵",
      summary: "با توجه به بخشنامه جدید سازمان امور مالیاتی، تمامی فرمول‌های محاسباتی مالیات در نسخه جدید به‌روزرسانی شده و به صورت خودکار اعمال می‌گردند.",
      category: "اطلاعیه مهم"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800" dir="rtl">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <Activity className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                سیستم جامع <span className="text-indigo-600">تراز</span>
              </h1>
            </div>
            
            <div className="hidden md:flex space-x-8 space-x-reverse">
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-bold transition-colors">صفحه اصلی</a>
              <a href="#news" className="text-slate-600 hover:text-indigo-600 font-bold transition-colors">اخبار و مقالات</a>
              <a href="#links" className="text-slate-600 hover:text-indigo-600 font-bold transition-colors">لینک‌های مهم</a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-bold transition-colors">پشتیبانی</a>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={onLoginClick}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
              >
                <LogIn className="w-5 h-5" />
                ورود به سیستم
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-indigo-50/50 mix-blend-multiply" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/3" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-24 lg:pt-32 lg:pb-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-8">
              مدیریت هوشمند کسب‌و‌کار با <span className="text-indigo-600">تراز</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
              نرم‌افزار جامع حسابداری و مدیریت مالی، با رابط کاربری مدرن، امنیت بالا و ابزارهای تحلیلی پیشرفته، مسیر موفقیت کسب‌و‌کار شما را هموار می‌کند.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onLoginClick}
                className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/20"
              >
                ورود به پنل کاربری
                <ArrowLeft className="w-6 h-6" />
              </button>
              <a 
                href="#news"
                className="flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-sm border border-slate-200"
              >
                مشاهده آخرین اخبار
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content: News & Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Price Inquiry Section */}
          <div id="inquiry" className="lg:col-span-3 space-y-8 mb-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6 relative z-10">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">استعلام سریع قیمت کالا</h3>
                  <p className="text-slate-500 text-sm mt-1">بدون نیاز به ورود به سیستم، قیمت کالاها را در کسب‌وکارهای مختلف جستجو کنید.</p>
                </div>
              </div>
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">انتخاب کسب‌و‌کار</label>
                  <div className="relative">
                    <Database className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={selectedBusiness}
                      onChange={(e) => {
                        setSelectedBusiness(e.target.value);
                        setSearchResults([]);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 pl-4 pr-10 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none appearance-none font-medium transition-all"
                    >
                      <option value="">لطفاً یک کسب‌و‌کار انتخاب کنید...</option>
                      {businesses.map((b, idx) => (
                        <option key={`bus-${idx}`} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-8">
                  <label className="block text-sm font-bold text-slate-700 mb-2">جستجوی کالا (نام، بارکد یا کد)</label>
                  <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                      <Package className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        disabled={!selectedBusiness}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={selectedBusiness ? "نام کالا، بارکد یا کد کالا را وارد کنید..." : "ابتدا یک کسب‌و‌کار انتخاب کنید..."}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 pl-4 pr-10 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none font-medium transition-all disabled:opacity-50"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!selectedBusiness || !searchQuery.trim() || isSearching}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 min-w-[120px]"
                    >
                      {isSearching ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>جستجو</>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h4 className="text-sm font-bold text-slate-500 mb-4">نتایج جستجو:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((product, idx) => (
                      <div key={`search-${idx}`} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-slate-900 truncate" title={product.name}>{product.name}</h5>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            {product.code && <span>کد: {toPersianDigits(product.code)}</span>}
                            {product.code && product.barcode && <span className="w-1 h-1 bg-slate-300 rounded-full" />}
                            {product.barcode && <span>بارکد: {toPersianDigits(product.barcode)}</span>}
                          </div>
                          <div className="mt-3 flex items-baseline gap-1">
                            <span className="text-lg font-black text-emerald-600">{toPersianDigits(Number(product.salePrice).toLocaleString())}</span>
                            <span className="text-xs font-bold text-emerald-700/70">ریال</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {searchResults.length === 0 && searchQuery && !isSearching && (
                 <div className="mt-8 border-t border-slate-100 pt-8 text-center">
                    <p className="text-slate-500 font-medium">کالایی با این مشخصات یافت نشد.</p>
                 </div>
              )}
            </div>
          </div>

          
          {/* News / Blog Section (Takes up 2 columns on lg) */}
          <div id="news" className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                <Newspaper className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">اخبار و اطلاعیه‌ها</h3>
            </div>
            
            <div className="space-y-6">
              {news.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  key={item.id} 
                  className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold">
                      {item.category}
                    </span>
                    <span className="text-slate-400 text-sm font-semibold">{item.date}</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed mb-4 text-justify">
                    {item.summary}
                  </p>
                  <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    ادامه مطلب
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Important Links Sidebar (Takes 1 column on lg) */}
          <div id="links" className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900">لینک‌های مهم</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { title: "راهنمای جامع کار با سیستم", icon: BookOpen },
                  { title: "قوانین و مقررات استفاده", icon: ShieldCheck },
                  { title: "سوالات متداول (FAQ)", icon: Bell },
                  { title: "دانلود کاتالوگ امکانات", icon: ArrowLeft },
                ].map((link, idx) => (
                  <a key={idx} href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-colors border border-transparent hover:border-slate-100">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                      <link.icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">{link.title}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-xl font-black mb-4 relative z-10">نیاز به پشتیبانی دارید؟</h3>
              <p className="text-indigo-100 mb-6 text-sm leading-relaxed relative z-10">
                تیم پشتیبانی ما به صورت ۲۴ ساعته در ۷ روز هفته آماده پاسخگویی به سوالات و رفع مشکلات شما می‌باشد.
              </p>
              <button className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-3 rounded-xl transition-colors relative z-10 shadow-md">
                تماس با پشتیبانی
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm font-medium">
          <p>© {new Date().toLocaleDateString('fa-IR', { year: 'numeric' })} تمامی حقوق برای سیستم جامع تراز محفوظ است.</p>
        </div>
      </footer>
    </div>
  );
}
