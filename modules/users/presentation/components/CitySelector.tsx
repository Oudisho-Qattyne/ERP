// src/components/forms/CitySelector.tsx
'use client';

import { Button } from '@/modules/shared/presentation/components/ui/buttons/Button';
import { Input } from '@/modules/shared/presentation/components/ui/inputs/Input.tsx';
import { SelectOrCreate } from '@/modules/shared/presentation/components/ui/inputs/SelectOrCreate';
import { useState } from 'react';

// Global cities list (could be fetched from API)
let cities = [
  { value: 'damascus', label: 'دمشق' },
  { value: 'aleppo', label: 'حلب' },
  { value: 'homs', label: 'حمص' },
];

interface CitySelectorProps {
  value?: string;
  onChange: (cityValue: string) => void;
  error?: string;
}

export function CitySelector({ value, onChange, error }: CitySelectorProps) {
  const [newCityName, setNewCityName] = useState('');

  const handleCreateForm = (onSuccess: (val: string, newItem: any) => void, onCancel: () => void) => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!newCityName.trim()) return;
          const newValue = newCityName.toLowerCase().replace(/\s/g, '-');
          const newOption = { value: newValue, label: newCityName.trim() };
          cities.push(newOption);
          onSuccess(newValue, newOption);
        }}
        className="space-y-4"
      >
        <Input
          label="اسم المدينة"
          value={newCityName}
          onChange={setNewCityName}
          placeholder="مثال: اللاذقية"
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onCancel}>إلغاء</Button>
          <Button type="submit" variant="primary">إضافة</Button>
        </div>
      </form>
    );
  };

  return (
    <SelectOrCreate
      value={value}
      onChange={(val) => onChange(val)}
      options={cities}
      label="المدينة"
      placeholder="اختر مدينة أو أضف جديدة"
      error={error}
      createTitle="إضافة مدينة جديدة"
      renderCreateForm={handleCreateForm}
    />
  );
}