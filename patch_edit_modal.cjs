const fs = require('fs');
let code = fs.readFileSync('src/components/modals/EditReceiptModal.tsx', 'utf-8');

// The main grid
code = code.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-6">/g,
  '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">'
);

const personBlock = `            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" /> طرف حساب شخص/شرکت *`;
const personBlockNew = `            <div className="md:col-span-2 lg:col-span-4">
              <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" /> طرف حساب شخص/شرکت *`;
code = code.replace(personBlock, personBlockNew);

const dateBlock = `            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" /> تاریخ سند`;
const dateBlockNew = `            <div className="lg:col-span-2">
              <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" /> تاریخ سند`;
code = code.replace(dateBlock, dateBlockNew);

const amountBlock = `            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-slate-400" /> مبلغ کل سند (تومان) *`;
const amountBlockNew = `            <div className="lg:col-span-2">
              <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-slate-400" /> مبلغ کل سند (تومان) *`;
code = code.replace(amountBlock, amountBlockNew);

const lettersBlock = `<div className="md:col-span-2 bg-slate-50 border p-4 rounded-xl text-xs space-y-1">`;
const lettersBlockNew = `<div className="md:col-span-2 lg:col-span-4 bg-slate-50 border p-4 rounded-xl text-xs space-y-1">`;
code = code.replace(lettersBlock, lettersBlockNew);

fs.writeFileSync('src/components/modals/EditReceiptModal.tsx', code, 'utf-8');
console.log('EditReceiptModal patched');
