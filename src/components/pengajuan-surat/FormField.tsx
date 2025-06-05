import React from "react";
import { SuratPayload } from "@/types/surat";

interface FormFieldProps {
  label: string;
  name: keyof SuratPayload;
  type?: string;
  value?: string | number;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  required?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
  as?: "textarea" | "select";
  rows?: number;
  className?: string; // Allow passing additional classes
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  onChange,
  required = false,
  placeholder,
  children,
  as,
  rows,
  className = "",
}) => (
  // Apply passed className
  <div className={className}>
    <label
      htmlFor={name}
      className="mb-1 block text-sm font-medium text-gray-700"
    >
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {as === "textarea" ? (
      <textarea
        id={name}
        name={name}
        rows={rows || 3}
        className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    ) : as === "select" ? (
      <select
        id={name}
        name={name}
        className="mt-1 block w-full rounded-md border-gray-300 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        onChange={onChange}
        required={required}
      >
        {children}
      </select>
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    )}
  </div>
);

export default FormField;
