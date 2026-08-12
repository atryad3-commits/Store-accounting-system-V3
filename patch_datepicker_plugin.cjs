const fs = require('fs');
let code = fs.readFileSync('src/components/ui/CustomDatePicker.tsx', 'utf8');

const replacement = `const TodayButton = ({ setValue, range, onChange, date }: any) => {
  return (
    <div className="flex justify-center p-2 border-t border-gray-100 bg-gray-50/50">
      <button
        type="button"
        onClick={() => {
          let newValue;
          if (range) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const endToday = new Date();
            endToday.setHours(23, 59, 59, 999);
            newValue = [today, endToday];
          } else {
            newValue = new Date();
          }
          if (typeof setValue === 'function') setValue(newValue);
          else if (typeof onChange === 'function') onChange(newValue);
        }}
        className="w-full py-1.5 px-4 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-colors"
      >
        هم‌اکنون (امروز)
      </button>
    </div>
  );
};`;

code = code.replace(/const TodayButton = \(\{ onSelectToday, range \}: any\) => \{[\s\S]*?\n\};/, replacement);

code = code.replace(
  /<TodayButton position="bottom" range=\{props\.range\} onSelectToday=\{[\s\S]*?\} \/>/g,
  `<TodayButton position="bottom" range={props.range} />`
);

fs.writeFileSync('src/components/ui/CustomDatePicker.tsx', code);
