// src/hooks/useDependentField.ts
import { useEffect, useState } from 'react';
import { useFormContext, Path, FieldValues } from 'react-hook-form';

export interface ComputedProps {
  value?: any;
  options?: { value: string; label: string }[];
  disabled?: boolean;
  hidden?: boolean;
  placeholder?: string;
  required?: boolean;
  [key: string]: any; // allow extra data
}

export function useDependentField<T extends FieldValues>(
  dependsOn: Path<T>[],
  compute: (values: Record<Path<T>, any>) => ComputedProps | Promise<ComputedProps>
) {
  const { watch, getValues, setValue } = useFormContext<T>();
  const [computed, setComputed] = useState<ComputedProps>({});
  const [loading, setLoading] = useState(false);

  const watchedValues = watch(dependsOn);

  useEffect(() => {
    let isMounted = true;
    const update = async () => {
      setLoading(true);
      const currentValues = getValues();
      const result = await compute(currentValues);
      if (isMounted) {
        setComputed(result);
        setLoading(false);
      }
    };
    update();
    return () => { isMounted = false; };
  }, [watchedValues, compute, getValues]);

  // If computed.value is defined and different from current field value, auto-set it
  useEffect(() => {
    if (computed.value !== undefined && computed.value !== getValues(dependsOn[0] as any)) {
      setValue(dependsOn[0] as any, computed.value, { shouldValidate: true });
    }
  }, [computed.value, dependsOn, getValues, setValue]);

  return { computed, loading };
}