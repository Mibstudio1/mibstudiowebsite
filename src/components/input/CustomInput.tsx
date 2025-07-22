import React from "react";

interface CustomInputProps {
  type?: string;
  name?: string;
  labelEn?: string;
  label?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}
export const CustomInput = ({
  type = "text",
  name,
  label,
  labelEn,
  placeholder,
  value,
  onChange,
  required,
}: CustomInputProps) => {
  return (
    <div className="space-y-4 md:-space-y-0">
      <label className="text-white text-sm md:text-base font-bold md:text-gray-800">
        {labelEn}
        {required && !value && <span className="text-red-500 ml-1">*</span>}
      </label>
      <label className="text-white opacity-80 text-xs md:text-sm font-medium md:text-gray-600 block mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-xs md:text-sm text-gray-900 placeholder-gray-500 
                   focus:border-gray-800 focus:ring-2 focus:ring-gray-200 focus:outline-none 
                   transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white
                   shadow-sm hover:shadow-md focus:shadow-lg"
      />
    </div>
  );
};
