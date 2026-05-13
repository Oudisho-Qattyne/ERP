// src/components/ui/DependentInput.tsx
'use client';

import React from 'react';
import { useFormContext, Path, FieldValues } from 'react-hook-form';
import { SelectOrCreate } from './SelectOrCreate';
import { Input, InputType } from './Input.tsx';
import { ComputedProps, useDependentField } from '../../../hooks/useDependentField';

export interface DependentInputProps<T extends FieldValues> {
  name: Path<T>;
  type?: InputType | 'select-or-create';
  label?: string;
  placeholder?: string;
  required?: boolean;
  // Dependency configuration
  dependsOn?: Path<T>[];
  compute?: (values: Record<Path<T>, any>) => ComputedProps | Promise<ComputedProps>;
  // Additional props for specific types
  options?: { value: string; label: string }[];       // for static select
  createTitle?: string;                               // for select-or-create
  renderCreateForm?: (onSuccess: (val: string, item: any) => void, onCancel: () => void) => React.ReactNode;
  // Other input props
  rows?: number;
  accept?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function DependentInput<T extends FieldValues>({
  name,
  type = 'text',
  label,
  placeholder,
  required = false,
  dependsOn = [],
  compute,
  options: staticOptions = [],
  createTitle = 'إضافة جديد',
  renderCreateForm,
  rows,
  accept,
  min,
  max,
  step,
}: DependentInputProps<T>) {
  const { register, setValue, getValues, formState: { errors } } = useFormContext<T>();
  const currentValue = getValues(name);
  const error = errors[name]?.message as string | undefined;

  // If dependencies are provided, compute dynamic props
  let dynamicProps: ComputedProps = {};
  let loading = false;

  if (dependsOn.length > 0 && compute) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const hookResult = useDependentField(dependsOn, compute);
    dynamicProps = hookResult.computed;
    loading = hookResult.loading;
  }

  // Merge static and dynamic props (dynamic take precedence)
  const finalProps = {
    disabled: dynamicProps.disabled,
    hidden: dynamicProps.hidden,
    placeholder: dynamicProps.placeholder ?? placeholder,
    required: dynamicProps.required ?? required,
    value: dynamicProps.value !== undefined ? dynamicProps.value : currentValue,
    options: dynamicProps.options ?? staticOptions,
  };

  if (dynamicProps.hidden) return null;
  if (loading && !finalProps.value) {
    return <div className="text-sm text-muted">جاري التحميل...</div>;
  }

  // Helper to update field value
  const handleChange = (val: any) => {
    setValue(name, val, { shouldValidate: true });
  };

  const commonProps = {
    name,
    label,
    placeholder: finalProps.placeholder,
    required: finalProps.required,
    disabled: finalProps.disabled,
    error,
  };

  // Render based on type
  switch (type) {
    case 'select-or-create':
      return (
        <SelectOrCreate
          value={finalProps.value}
          onChange={handleChange}
          options={finalProps.options}
          label={label}
          placeholder={finalProps.placeholder}
          required={finalProps.required}
          disabled={finalProps.disabled}
          error={error}
          createTitle={createTitle}
          renderCreateForm={renderCreateForm || ((onSuccess, onCancel) => (
            <div>نموذج إنشاء افتراضي – وفر `renderCreateForm`</div>
          ))}
        />
      );

    case 'textarea':
      return (
        <Input
          type="textarea"
          rows={rows}
          {...commonProps}
          value={finalProps.value}
          onChange={handleChange}
        />
      );

    case 'select':
      return (
        <Input
          type="select"
          options={finalProps.options}
          {...commonProps}
          value={finalProps.value}
          onChange={handleChange}
        />
      );

    case 'file':
      return (
        <Input
          type="file"
          accept={accept}
          {...commonProps}
          value={finalProps.value}
          onChange={handleChange}
        />
      );

    case 'image':
      return (
        <Input
          type="image"
          accept={accept}
          {...commonProps}
          value={finalProps.value}
          onChange={handleChange}
        />
      );

    case 'number':
      return (
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          {...commonProps}
          value={finalProps.value}
          onChange={handleChange}
        />
      );

    default:
      return (
        <Input
          type={type as InputType}
          {...commonProps}
          value={finalProps.value}
          onChange={handleChange}
        />
      );
  }
}