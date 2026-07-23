const fs = require('fs');
let content = fs.readFileSync('src/components/WelcomePage.tsx', 'utf8');

const importsToReplace = `import { LogIn, ArrowLeft, BookOpen, Bell, Activity, Newspaper, ChevronLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';`;

const newImports = `import { useState, useEffect } from 'react';
import { LogIn, ArrowLeft, BookOpen, Bell, Activity, Newspaper, ChevronLeft, ShieldCheck, Search, Database, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { toPersianDigits } from '../utils/format';`;

content = content.replace("import React from 'react';\nimport { LogIn, ArrowLeft, BookOpen, Bell, Activity, Newspaper, ChevronLeft, ShieldCheck } from 'lucide-react';\nimport { motion } from 'framer-motion';", "import React, { useState, useEffect } from 'react';\nimport { LogIn, ArrowLeft, BookOpen, Bell, Activity, Newspaper, ChevronLeft, ShieldCheck, Search, Database, Package } from 'lucide-react';\nimport { motion } from 'framer-motion';\nimport { toPersianDigits } from '../utils/format';");

const componentStart = `export default function WelcomePage({ onLoginClick }: { onLoginClick: () => void }) {`;

const newStates = `
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
      const res = await fetch('/api/products', {
        headers: {
          'x-store-id': selectedBusiness
        }
      });
      const data = await res.json();
      if (data.success && data.products) {
        const q = searchQuery.toLowerCase();
        const results = data.products.filter((p: any) => 
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
`;

content = content.replace(componentStart, componentStart + newStates);


const inquirySection = `
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
                      {businesses.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
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
                    {searchResults.map((product) => (
                      <div key={product.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-start gap-4">
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
`;

content = content.replace('{/* Main Content: News & Links */}\n      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">\n        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">', '{/* Main Content: News & Links */}\n      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">\n        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">\n' + inquirySection);

fs.writeFileSync('src/components/WelcomePage.tsx', content);
