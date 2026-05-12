
'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../buttons/Button';
import { Dialog } from '../dialog/Dialog';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectOrCreateProps {
  value?: string;
  onChange: (value: string, newItem?: any) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  // Creation dialog props
  createTitle: string;
  renderCreateForm: (onSuccess: (newValue: string, newItem: any) => void, onCancel: () => void) => React.ReactNode;
}

export function SelectOrCreate({
  value,
  onChange,
  options,
  placeholder = 'اختر...',
  label,
  required,
  error,
  disabled = false,
  createTitle,
  renderCreateForm,
}: SelectOrCreateProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  const handleCreateSuccess = (newValue: string, newItem: any) => {
    onChange(newValue, newItem);
    setIsDialogOpen(false);
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-text">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        {/* Dropdown select */}
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value, undefined)}
          disabled={disabled}
          className={`
            flex-1 px-3 py-2 rounded-md border border-border bg-card text-text text-sm
            focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            rtl:text-right
            ${error ? 'border-danger' : ''}
          `}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Create button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus size={14} />}
          onClick={() => setIsDialogOpen(true)}
          disabled={disabled}
          className="shrink-0"
        >
          {disabled ? '' : 'جديد'}
        </Button>
      </div>
      {error && <div className="text-danger text-xs mt-1">{error}</div>}

      {/* Creation Dialog */}
      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={createTitle} size="md">
        {renderCreateForm(handleCreateSuccess, () => setIsDialogOpen(false))}
      </Dialog>
    </div>
  );
}