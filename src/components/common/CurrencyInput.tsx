import React, { useState, useEffect } from "react";
import { addCommas, numberToWords } from "../../utils/format";

export const CurrencyInput = ({
  value,
  onChange,
  placeholder,
  className,
  hideWords,
  currencyLabel,
  ...props
}: any) => {
  const [localVal, setLocalVal] = useState(value ? addCommas(value) : "");
  useEffect(() => {
    if (value !== undefined) {
      setLocalVal(addCommas(value));
    }
  }, [value]);
  const handleChange = (e: any) => {
    let raw = e.target.value.replace(/,/g, "");
    if (raw && isNaN(Number(raw))) return;
    setLocalVal(addCommas(raw));
    if (onChange) onChange({ target: { value: raw } });
  };
  return (
    <div className="w-full relative">
      <input
        type="text"
        dir="ltr"
        value={localVal}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${className} text-left`}
        {...props}
      />
      {!hideWords && localVal && localVal !== "0" && (
        <p className="text-[10px] text-gray-500 font-medium mt-1 px-1 absolute -bottom-5 right-0 z-10 w-max">
          {numberToWords(localVal)} {currencyLabel || "تومان"}
        </p>
      )}
    </div>
  );
};

export default CurrencyInput;
