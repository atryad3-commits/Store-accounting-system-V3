const fs = require('fs');
const file = 'src/components/payroll/CreateSalaryPayroll.tsx';
let code = fs.readFileSync(file, 'utf-8');

// Add setIsPersonModalOpen to destructuring
if (!code.includes('setIsPersonModalOpen,')) {
  code = code.replace(/setSalaryDescription, submittingSalary/, "setSalaryDescription, submittingSalary, setIsPersonModalOpen,");
}

const oldSelect = `<SearchableSelect
                      options={(activePersonsOnly || []).map((p) => ({
                        value: p.id,`;

const newSelect = `<div className="flex gap-2">
                      <div className="flex-1">
                        <SearchableSelect
                          options={(activePersonsOnly || []).map((p) => ({
                            value: p.id,`;

const oldSelectEnd = `                      onChange={(val) => setSalaryPersonId(val)}
                      placeholder="-- جستجو و انتخاب کارمند --"
                      searchPlaceholder="جستجو نام، کد یا نقش..."
                    />`;

const newSelectEnd = `                        onChange={(val) => setSalaryPersonId(val)}
                        placeholder="-- جستجو و انتخاب کارمند --"
                        searchPlaceholder="جستجو نام، کد یا نقش..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPersonModalOpen && setIsPersonModalOpen(true)}
                        className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl px-4 flex items-center justify-center transition-colors shadow-sm"
                        title="تعریف شخص جدید"
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>
                    </div>`;

if (code.includes(oldSelect)) {
  code = code.replace(oldSelect, newSelect);
  code = code.replace(oldSelectEnd, newSelectEnd);
  
  if (!code.includes('UserPlus')) {
    code = code.replace('User,', 'User, UserPlus,');
  }

  fs.writeFileSync(file, code, 'utf-8');
  console.log('Patched CreateSalaryPayroll');
} else {
  console.log('Could not find pattern in CreateSalaryPayroll');
}
