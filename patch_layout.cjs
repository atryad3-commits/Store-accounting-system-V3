const fs = require('fs');
let code = fs.readFileSync('src/components/financial/PayReceiptModal.tsx', 'utf-8');

// 1. Update the grid container
code = code.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">/g,
  '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">'
);

// 2. Receipt Number
const receiptNumBlock = `                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <FileText className="w-4 h-4" /> شماره رسید`;
const receiptNumBlockNew = `                  <div className="lg:col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <FileText className="w-4 h-4" /> شماره رسید`;
code = code.replace(receiptNumBlock, receiptNumBlockNew);

// 3. Person Selection
const personBlock = `                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <User className="w-4 h-4" /> طرف حساب (شخص/شرکت)`;
const personBlockNew = `                  <div className="lg:col-span-3 md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <User className="w-4 h-4" /> طرف حساب (شخص/شرکت)`;
code = code.replace(personBlock, personBlockNew);

// 4. Update the Description textarea to span 4 columns
const descBlock = `<div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      توضیحات و بابت`;
const descBlockNew = `<div className="md:col-span-2 lg:col-span-4">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      توضیحات و بابت`;
code = code.replace(descBlock, descBlockNew);

// If there's Checkbook select, maybe make it span 2 on lg
const checkbookBlock = `                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      انتخاب دسته چک (بانک شما) *`;
const checkbookBlockNew = `                  <div className="lg:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      انتخاب دسته چک (بانک شما) *`;
code = code.replace(checkbookBlock, checkbookBlockNew);

// Check Bank Name
const checkBankNameBlock = `                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      نام بانک صادرکننده چک *`;
const checkBankNameBlockNew = `                  <div className="lg:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      نام بانک صادرکننده چک *`;
code = code.replace(checkBankNameBlock, checkBankNameBlockNew);


fs.writeFileSync('src/components/financial/PayReceiptModal.tsx', code, 'utf-8');
console.log('Layout patched');
