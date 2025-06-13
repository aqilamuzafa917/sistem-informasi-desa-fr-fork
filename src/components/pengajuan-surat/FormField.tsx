import React from "react";

interface FormFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: unknown } },
  ) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
  as?: "input" | "textarea" | "select";
  options?: { value: string; label: string }[];
  className?: string;
  showNama?: boolean;
  namaPenduduk?: string | null;
  loadingNama?: boolean;
  errorNama?: string | null;
  children?: React.ReactNode;
  rows?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder,
  type = "text",
  as = "input",
  options,
  className = "",
  showNama = false,
  namaPenduduk,
  loadingNama = false,
  errorNama,
  children,
  rows = 3,
  min,
  max,
  step,
}) => (
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
        value={value || ""}
        rows={rows}
        className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    ) : as === "select" ? (
      <select
        id={name}
        name={name}
        value={value || ""}
        className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        onChange={onChange}
        required={required}
      >
        {children ||
          options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value || ""}
        min={min}
        max={max}
        step={step}
        className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    )}

    {/* Tampilan nama penduduk */}
    {showNama && (
      <div className="mt-2">
        {loadingNama && (
          <div className="flex items-center text-sm text-blue-600">
            <svg
              className="mr-2 -ml-1 h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Mencari data...
          </div>
        )}
        {namaPenduduk && !loadingNama && (
          <div className="flex items-center text-sm text-green-600">
            <svg
              className="mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Nama: <span className="ml-1 font-medium">{namaPenduduk}</span>
          </div>
        )}
        {errorNama && !loadingNama && (
          <div className="flex items-center text-sm text-red-600">
            <svg
              className="mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errorNama}
          </div>
        )}
      </div>
    )}
  </div>
);

export default FormField;
