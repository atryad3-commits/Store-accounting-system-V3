import React, { useState } from "react";
import { motion } from "framer-motion";
import { Printer, X, Plus, Minus } from "lucide-react";
import Barcode from "react-barcode";
const formatNumber = (num: number) => new Intl.NumberFormat('fa-IR').format(num || 0);

interface PrintBarcodeModalProps {
  product: any;
  onClose: () => void;
  storeSettings?: any;
}

export default function PrintBarcodeModal({ product, onClose, storeSettings }: PrintBarcodeModalProps) {
  const [labelCount, setLabelCount] = useState(12);

  const barcodeValue = product.barcode || product.code;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:bg-white print:p-0 print:absolute print:inset-0 print:z-auto print:block"
      dir="rtl"
    >
      <style>{`
        @media print {
          @page {
            size: A5;
            margin: 5mm;
          }
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: min-content;
            gap: 2mm;
          }
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col print:shadow-none print:w-full print:h-auto print:max-w-none print:max-h-none print:overflow-visible print:p-0 print:m-0 print:bg-transparent"
      >
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 print:hidden">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-500" />
            چاپ لیبل قیمت (A5)
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto print:hidden">
          <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4">تنظیمات چاپ</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-600">تعداد لیبل:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLabelCount(Math.max(1, labelCount - 1))}
                  className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-mono font-bold text-lg w-8 text-center">{labelCount}</span>
                <button
                  onClick={() => setLabelCount(labelCount + 1)}
                  className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">توصیه: ۱۲ لیبل برای یک برگ A5 مناسب است.</p>
          </div>

          <div className="border border-slate-200 p-4 rounded-xl shadow-sm text-center w-full max-w-xs mx-auto bg-white flex flex-col justify-center items-center">
            <div className="font-extrabold text-slate-900 text-sm mb-2 truncate px-2 w-full">
              {product.name}
            </div>
            <div className="flex justify-center my-2 text-center w-full overflow-hidden">
              {barcodeValue ? (
                <Barcode
                  value={barcodeValue}
                  format="CODE128"
                  width={1.5}
                  height={40}
                  fontSize={12}
                  textMargin={2}
                  margin={0}
                  background="#ffffff"
                  lineColor="#000000"
                />
              ) : (
                <div className="py-6 text-slate-400 text-xs font-bold bg-slate-50 rounded-lg w-full border border-slate-100">
                  بدون کد/بارکد
                </div>
              )}
            </div>
            <div className="text-sm font-black text-indigo-700 flex justify-between w-full mt-2 px-1">
              <span>قیمت:</span>
              <span>
                {formatNumber(product.price)} {storeSettings?.currency || "تومان"}
              </span>
            </div>
          </div>
        </div>

        {/* Print Layout */}
        <div className="hidden print:flex print-container print:w-full" dir="rtl">
          {Array.from({ length: labelCount }).map((_, index) => (
            <div key={index} className="border border-black p-2 bg-white flex flex-col justify-center items-center w-full h-[32mm] overflow-hidden rounded-lg">
              <div className="font-bold text-black text-[11px] mb-1 truncate px-1 w-full text-center leading-tight">
                {product.name}
              </div>
              <div className="flex justify-center text-center items-center overflow-hidden scale-90 origin-top">
                {barcodeValue ? (
                  <Barcode
                    value={barcodeValue}
                    format="CODE128"
                    width={1.5}
                    height={35}
                    fontSize={11}
                    textMargin={1}
                    margin={0}
                    background="#ffffff"
                    lineColor="#000000"
                    displayValue={true}
                  />
                ) : (
                  <div className="text-[10px]">بدون بارکد</div>
                )}
              </div>
              <div className="text-[12px] font-black text-black w-full text-center mt-1">
                {formatNumber(product.price)} {storeSettings?.currency || "تومان"}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all shadow-sm cursor-pointer"
          >
            بستن
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            disabled={!barcodeValue}
          >
            <Printer className="w-4 h-4" />
            چاپ لیبل (A5)
          </button>
        </div>
      </motion.div>
    </div>
  );
}
