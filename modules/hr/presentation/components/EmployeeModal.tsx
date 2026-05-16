import React, { useCallback } from 'react';
import { FormProvider } from 'react-hook-form';
import { EmployeeSchema, EmployeeFormValues } from '../../application/dto/EmployeeSchema';
import { Dialog } from '../../../shared/presentation/components/ui/dialog/Dialog';
import { Button } from '../../../shared/presentation/components/ui/buttons/Button';
import { Input } from '../../../shared/presentation/components/ui/inputs/Input';
import { DependentInput } from '../../../shared/presentation/components/ui/inputs/DependentInput';
import { useDynamicForm } from '../../../shared/presentation/hooks/useDynamicForm';
import { ComputedProps } from '../../../shared/presentation/hooks/useDependentField';
import { Employee } from '../../domain/entities/Employee';

import { UserPlus } from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmployeeFormValues) => void;
  initialData?: Partial<Employee>;
}

import { useLanguage } from '../../../shared/presentation/context/LanguageContext';

export function EmployeeModal({ isOpen, onClose, onSave, initialData }: EmployeeModalProps) {
  const { t } = useLanguage();
  const { form, handleSubmit, fieldProps, isSubmitting } = useDynamicForm<EmployeeFormValues>({
    schema: EmployeeSchema,
    defaultValues: (initialData || {}) as any,
  });

  const onSubmit = (data: EmployeeFormValues) => {
    onSave(data);
    onClose();
  };

  // Optimized compute function using useCallback
  const computeCascade = useCallback(async (values: any): Promise<ComputedProps> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
      options: [
        { value: '1', label: 'خيار ديناميكي 1' },
        { value: '2', label: 'خيار ديناميكي 2' },
        { value: '3', label: 'خيار ديناميكي 3' },
      ],
      disabled: false,
    };
  }, []);

  const computeBasic = useCallback(async (): Promise<ComputedProps> => {
    return {
      options: [
        { value: 'syr', label: 'سوريا' },
        { value: 'lebanon', label: 'لبنان' },
      ],
    };
  }, []);

  if (!isOpen) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={<div className="flex items-center gap-2 text-white"><UserPlus size={20} className="text-white" /> <span>{t('employees.add', 'hr')}</span></div>} size="2xl">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

            <div className="col-span-full border-b border-border pb-2 mb-2 font-bold text-lg text-primary">{t('employees.sections.personal', 'hr')}</div>
            <Input {...fieldProps('first_name', { label: t('employees.fields.first_name', 'hr') })} />
            <Input {...fieldProps('father_name', { label: t('employees.fields.father_name', 'hr') })} />
            <Input {...fieldProps('surname', { label: t('employees.fields.surname', 'hr') })} />
            <Input {...fieldProps('mother_name', { label: t('employees.fields.mother_name', 'hr') })} />
            <Input {...fieldProps('full_name', { label: t('employees.fields.full_name', 'hr') })} />
            <Input {...fieldProps('national_id', { label: t('employees.fields.national_id', 'hr') })} />
            <Input {...fieldProps('personal_id', { label: t('employees.fields.personal_id', 'hr') })} />
            <Input {...fieldProps('date_of_birth', { label: t('employees.fields.date_of_birth', 'hr'), type: 'date' })} />
            <Input {...fieldProps('place_of_birth', { label: t('employees.fields.place_of_birth', 'hr') })} />
            <Input {...fieldProps('registration', { label: t('employees.fields.registration', 'hr') })} />
            <Input {...fieldProps('gender', { label: t('employees.fields.gender', 'hr'), type: 'select' })} options={[{ value: 'male', label: t('employees.values.male', 'hr') }, { value: 'female', label: t('employees.values.female', 'hr') }]} />
            <Input {...fieldProps('marital_status', { label: t('employees.fields.marital_status', 'hr'), type: 'select' })} options={[{ value: 'single', label: t('employees.values.single', 'hr') }, { value: 'married', label: t('employees.values.married', 'hr') }]} />

            {form.watch('marital_status') === 'married' && (
              <>
                <Input {...fieldProps('spouse_name', { label: t('employees.fields.spouse_name', 'hr') })} />
                <Input {...fieldProps('spouse_employer', { label: t('employees.fields.spouse_employer', 'hr') })} />
              </>
            )}

            <div className="col-span-full border-b border-border pb-2 mb-2 font-bold text-lg text-primary mt-6">{t('employees.sections.residence', 'hr')}</div>
            <DependentInput
              name="country_id"
              label={t('employees.fields.country', 'hr')}
              type="select"
              compute={computeBasic}
            />
            <DependentInput
              name="original_governorate_id"
              label={t('employees.fields.original_governorate', 'hr')}
              type="select"
              dependsOn={['country_id']}
              compute={computeCascade}
            />
            <DependentInput
              name="region_id"
              label={t('employees.fields.region', 'hr')}
              type="select"
              dependsOn={['original_governorate_id']}
              compute={computeCascade}
            />
            <DependentInput
              name="residence_governorate_id"
              label={t('employees.fields.residence_governorate', 'hr')}
              type="select"
              compute={computeCascade}
            />
            <DependentInput
              name="residential_area_id"
              label={t('employees.fields.residential_area', 'hr')}
              type="select"
              dependsOn={['residence_governorate_id']}
              compute={computeCascade}
            />

            <div className="col-span-full border-b border-border pb-2 mb-2 font-bold text-lg text-primary mt-6">{t('employees.sections.organization', 'hr')}</div>
            <DependentInput
              name="org_level_1_id"
              label={t('employees.fields.org_level_1', 'hr')}
              type="select"
              compute={computeCascade}
            />
            <DependentInput
              name="org_level_2_id"
              label={t('employees.fields.org_level_2', 'hr')}
              type="select"
              dependsOn={['org_level_1_id']}
              compute={computeCascade}
            />
            <DependentInput
              name="org_level_3_id"
              label={t('employees.fields.org_level_3', 'hr')}
              type="select"
              dependsOn={['org_level_2_id']}
              compute={computeCascade}
            />
            <DependentInput
              name="org_level_4_id"
              label={t('employees.fields.org_level_4', 'hr')}
              type="select"
              dependsOn={['org_level_3_id']}
              compute={computeCascade}
            />
            <DependentInput
              name="org_level_5_id"
              label={t('employees.fields.org_level_5', 'hr')}
              type="select"
              dependsOn={['org_level_4_id']}
              compute={computeCascade}
            />
            <Input {...fieldProps('org_level_6', { label: t('employees.fields.org_level_6', 'hr') })} />

            <Input {...fieldProps('job_title', { label: t('employees.fields.job_title', 'hr') })} />
            <Input {...fieldProps('job_category', { label: t('employees.fields.job_category', 'hr') })} />
            <Input {...fieldProps('status', { label: t('employees.fields.status', 'hr'), type: 'select' })} options={[{ value: 'active', label: t('employees.values.active', 'hr') }, { value: 'on_leave', label: t('employees.values.on_leave', 'hr') }]} />
            <Input {...fieldProps('date_of_appointment', { label: t('employees.fields.date_of_appointment', 'hr'), type: 'date' })} />
            <Input {...fieldProps('contract_pattern', { label: t('employees.fields.contract_pattern', 'hr') })} />
            <Input {...fieldProps('contract_nature', { label: t('employees.fields.contract_nature', 'hr') })} />

            <DependentInput
              name="workplace_governorate_id"
              label={t('employees.fields.workplace_governorate', 'hr')}
              type="select"
              compute={computeCascade}
            />

            <div className="col-span-full border-b border-border pb-2 mb-2 font-bold text-lg text-primary mt-6">{t('employees.sections.additional', 'hr')}</div>
            <Input {...fieldProps('phone_number', { label: t('employees.fields.phone_number', 'hr') })} />
            <Input {...fieldProps('sham_cash_account', { label: t('employees.fields.sham_cash_account', 'hr') })} />
            <Input {...fieldProps('health_status', { label: t('employees.fields.health_status', 'hr'), type: 'select' })} options={[{ value: 'healthy', label: t('employees.values.healthy', 'hr') }, { value: 'sick', label: t('employees.values.sick', 'hr') }]} />

            {form.watch('health_status') === 'sick' && (
              <>
                <Input {...fieldProps('illness_type', { label: t('employees.fields.illness_type', 'hr') })} />
                <Input {...fieldProps('illness_date', { label: t('employees.fields.illness_date', 'hr'), type: 'date' })} />
              </>
            )}

            <Input {...fieldProps('blood_type', { label: t('employees.fields.blood_type', 'hr') })} />

            <div className="col-span-full border-b border-border pb-2 mb-2 font-bold text-lg text-primary mt-6">{t('employees.sections.education', 'hr')}</div>
            <DependentInput name="appointment_certificate_id" label={t('employees.fields.appointment_certificate', 'hr')} type="select" compute={computeCascade} />
            <DependentInput name="appointment_university_id" label={t('employees.fields.appointment_university', 'hr')} type="select" compute={computeCascade} />
            <DependentInput
              name="appointment_college_id"
              label={t('employees.fields.appointment_college', 'hr')}
              type="select"
              dependsOn={['appointment_university_id']}
              compute={computeCascade}
            />
            <DependentInput
              name="appointment_specialization_id"
              label={t('employees.fields.appointment_specialization', 'hr')}
              type="select"
              dependsOn={['appointment_college_id']}
              compute={computeCascade}
            />
            <Input {...fieldProps('appointment_cert_year', { label: t('employees.fields.appointment_cert_year', 'hr') })} />

            <div className="col-span-full border-b border-border pb-2 mb-2 font-bold text-lg text-primary mt-6">{t('employees.sections.current_study', 'hr')}</div>
            <Input {...fieldProps('current_study_status', { label: t('employees.fields.current_study_status', 'hr'), type: 'select' })} options={[{ value: 'none', label: t('employees.values.none', 'hr') }, { value: 'studying', label: t('employees.values.studying', 'hr') }]} />

            {form.watch('current_study_status') === 'studying' && (
              <>
                <Input {...fieldProps('study_stage', { label: t('employees.fields.study_stage', 'hr') })} />
                <DependentInput name="current_study_university_id" label={t('employees.fields.appointment_university', 'hr')} type="select" compute={computeCascade} />
                <DependentInput
                  name="current_study_college_id"
                  label={t('employees.fields.appointment_college', 'hr')}
                  type="select"
                  dependsOn={['current_study_university_id']}
                  compute={computeCascade}
                />
                <DependentInput
                  name="current_study_specialization_id"
                  label={t('employees.fields.appointment_specialization', 'hr')}
                  type="select"
                  dependsOn={['current_study_college_id']}
                  compute={computeCascade}
                />
              </>
            )}

          </div>

          <div className="flex justify-end gap-3 mt-8 border-t border-border pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>{t('common.cancel', 'shared')}</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? t('employees.saving', 'hr') : t('employees.save', 'hr')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
}
