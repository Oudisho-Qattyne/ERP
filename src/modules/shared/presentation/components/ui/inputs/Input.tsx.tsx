import React from 'react';
import { ChevronDown } from 'lucide-react';

export type InputType = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'file' | 'email' | 'password' | string;

interface InputProps {
  type?: InputType;
  name?: string;
  value?: any;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  label?: string;
  rows?: number;               // for textarea
  options?: { value: string; label: string }[]; // for select
  accept?: string;             // for file
  min?: number;                // for number
  max?: number;
  step?: number;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  required,
  error,
  hint,
  label,
  rows = 3,
  options = [],
  accept,
  min,
  max,
  step,
}) => {
  // Base classes matching original 'inp' style but using Tailwind
  const baseClasses = `
    w-full px-3 py-2 rounded-md
    border border-border
    bg-card text-text text-sm
    outline-none transition-all duration-200
    focus:border-primary focus:ring-2 focus:ring-primary/20
    disabled:opacity-50 disabled:cursor-not-allowed
    placeholder:text-text-muted/50
    rtl:text-right ltr:text-left
    ${error ? 'border-danger focus:border-danger' : ''}
  `;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            rows={rows}
            value={value ?? ''}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`${baseClasses} resize-y`}
          />
        );

      case 'select':
        return (
          <div className="relative">
            <select
              id={name}
              name={name}
              value={value ?? ''}
              onChange={(e) => onChange?.(e.target.value)}
              onBlur={onBlur}
              disabled={disabled}
              required={required}
              className={`${baseClasses} appearance-none pr-8`}
            >
              <option value="">اختر...</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
          </div>
        );

      case 'file':
        return (
          <input
            id={name}
            name={name}
            type="file"
            accept={accept}
            onChange={(e) => onChange?.(e.target.files?.[0] || null)}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            className={`${baseClasses} p-1 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-primary-light file:text-primary file:cursor-pointer hover:file:bg-primary/20`}
          />
        );

      default: // text, number, date, email, password
        return (
          <input
            id={name}
            name={name}
            type={type === 'number' ? 'number' : type}
            value={type === 'number' ? (value ?? '') : (value ?? '')}
            onChange={(e) => {
              if (type === 'number') {
                onChange?.(e.target.value === '' ? undefined : Number(e.target.value));
              } else {
                onChange?.(e.target.value);
              }
            }}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            step={step}
            className={baseClasses}
          />
        );
    }
  };

  return (
    <div className="w-full mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-text mb-1.5">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      {renderInput()}
      {error && <div className="text-danger text-xs mt-1">{error}</div>}
      {hint && !error && <div className="text-text-muted text-xs mt-1">{hint}</div>}
    </div>
  );
};