import Num2persian from 'num2persian';
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";


export function addCommas(num: number | string): string {
    if (!num && num !== 0 && num !== '0') return '';
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

export function removeCommas(str: string): string {
    if (!str) return '';
    return str.toString().replace(/,/g, '');
}

export function parseNumberField(val: string): string {
    const raw = removeCommas(val);
    if (!raw) return '';
    if (isNaN(Number(raw))) return raw;
    return raw;
}

export const numberToWords = (num: string | number): string => {
    if (!num && num !== 0 && num !== '0') return '';
    const raw = num.toString().replace(/,/g, '');
    if (isNaN(Number(raw))) return '';
    
    return Num2persian(raw);
}

export const getBaseValueInToman = (cur: string) => {
  if (!cur) return 1;
  if (cur.includes('تومان')) return 1;
  if (cur.includes('ریال')) return 0.1;
  if (cur.includes('دلار') || cur.includes('USD')) return 70000;
  if (cur.includes('یورو') || cur.includes('EUR')) return 75000;
  if (cur.includes('درهم') || cur.includes('AED')) return 19000;
  return 1;
};

export const getDefaultExchangeRate = (invoiceCur: string, storeCur: string) => {
  if (invoiceCur === storeCur) return 1;
  const invToman = getBaseValueInToman(invoiceCur);
  const storeToman = getBaseValueInToman(storeCur);
  return invToman / storeToman;
};

export const showInvoiceCurrency = (c: string) => {
  if (!c) return 'تومان';
  if (c === 'IRT' || c === 'toman') return 'تومان';
  if (c === 'IRR' || c === 'rial') return 'ریال';
  if (c === 'USD' || c === 'dollar') return 'دلار';
  return c;
};

export function numToPersianWords(num: number): string {
  if (num === 0) return 'صفر';
  const yekan = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
  const dahgan = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
  const dahYek = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
  const sadgan = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
  const steps = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];

  const convertThreeDigit = (n: number): string => {
    if (n === 0) return '';
    let result = '';
    const s = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const y = n % 10;

    if (s > 0) result += sadgan[s];
    if (d > 0) {
      if (result) result += ' و ';
      if (d === 1) {
        result += dahYek[y];
        return result;
      } else {
        result += dahgan[d];
      }
    }
    if (y > 0) {
      if (result) result += ' و ';
      result += yekan[y];
    }
    return result;
  };

  let word = '';
  let stepCount = 0;
  let temp = Math.floor(num);

  while (temp > 0) {
    const section = temp % 1000;
    if (section > 0) {
      const sectionWord = convertThreeDigit(section);
      const stepWord = steps[stepCount] ? ' ' + steps[stepCount] : '';
      word = sectionWord + stepWord + (word ? ' و ' + word : '');
    }
    temp = Math.floor(temp / 1000);
    stepCount++;
  }
  return word.trim();
}

export function toPersianDigits(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/[0-9]/g, function (w) {
    return id[+w];
  });
}

export function formatDateDisplay(dateInput: string | Date | undefined | null, calendarType?: string): string {
  if (!dateInput || dateInput === "-") return "-";
  
  try {
    let d = new Date(dateInput);
    if (typeof dateInput === 'string' && dateInput.includes('/')) {
        const englishStr = dateInput.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
        const parts = englishStr.split("/");
        if (parts.length === 3) {
           const year = parseInt(parts[0], 10);
           if (year < 1500) {
              if (calendarType === 'gregorian') {
                 // Return as is if old jalali string
                 return dateInput;
              } else {
                 const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
                 const monthIndex = parseInt(parts[1], 10) - 1;
                 const day = parseInt(parts[2].split(" ")[0], 10);
                 if (monthIndex >= 0 && monthIndex < 12) {
                    return toPersianDigits(`‏${day} ${months[monthIndex]} ${year}‏`);
                 }
              }
           }
        }
    }

    if (!isNaN(d.getTime())) {
      if (calendarType === 'gregorian') {
         return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      } else if (calendarType === 'gregorian_time') {
         return d.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
      } else {
         if (calendarType === 'jalali_time') { return toPersianDigits(`‏${d.toLocaleString("fa-IR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}‏`); } return toPersianDigits(`‏${d.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" })}‏`);
      }
    }
  } catch (e) {}
  
  return calendarType === 'gregorian' ? String(dateInput) : toPersianDigits(String(dateInput));
}


export function convertToGregorian(dateInput: string | Date | null | undefined): string {
    if (!dateInput) return new Date().toISOString();
    if (typeof (dateInput as any).toDate === 'function') {
        return (dateInput as any).toDate().toISOString();
    }
    if (typeof dateInput === 'string') {
        if (dateInput.includes('T')) return dateInput; // Already ISO
        if (dateInput.includes('/')) {
            try {
                const englishStr = dateInput.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
                const year = parseInt(englishStr.split('/')[0], 10);
                if (year < 1500) {
                     const d = new DateObject({ date: englishStr, format: "YYYY/MM/DD", calendar: persian, locale: persian_fa });
                     return d.toDate().toISOString();
                } else {
                     const d = new Date(englishStr);
                     if (!isNaN(d.getTime())) return d.toISOString();
                }
            } catch (e) {
                // fallback
            }
        }
        const d2 = new Date(dateInput);
        if (!isNaN(d2.getTime())) return d2.toISOString();
        return new Date().toISOString();
    }
    if (dateInput instanceof Date) {
        if (!isNaN(dateInput.getTime())) return dateInput.toISOString();
    }
    return new Date().toISOString();
}

export const customPersonFilter = (option: any, inputValue: string) => {
  if (!inputValue) return true;
  const terms = inputValue.toLowerCase().split(" ").filter(Boolean);
  const searchable = (
    option.data?.searchStr ||
    option.label ||
    ""
  ).toLowerCase();
  return terms.every((term) => searchable.includes(term));
};

export function formatAmount(num: number | string, storeSettings?: any): string {
    if (!num && num !== 0 && num !== '0') return '';
    let val = Number(num);
    if (isNaN(val)) return num.toString();
    
    if (storeSettings && storeSettings.use_decimals === false) {
        val = Math.round(val);
    } else if (storeSettings && storeSettings.use_decimals === true) {
        const places = storeSettings.decimal_places || 2;
        val = Number(val.toFixed(places));
    } else {
        // default: round to 2 places maximum if not specified
        val = Number(val.toFixed(4));
    }
    return addCommas(val.toString());
}
