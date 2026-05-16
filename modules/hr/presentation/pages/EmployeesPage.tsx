'use client';

import React, { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { EmployeeModal } from '../components/EmployeeModal';
import { ResizableTable, ColumnDef } from '../../../shared/presentation/components/ui/tables/ResizableTable';
import { Employee } from '../../domain/entities/Employee';
import { Button } from '../../../shared/presentation/components/ui/buttons/Button';
import { EmployeeFormValues } from '../../application/dto/EmployeeSchema';
import { Plus } from 'lucide-react';

import { Pagination } from '../../../shared/presentation/components/ui/pagination/Pagination';

import { useLanguage } from '../../../shared/presentation/context/LanguageContext';

export function EmployeesPage() {
  const { employees, isLoading, error, createEmployee } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleSaveEmployee = async (data: EmployeeFormValues) => {
    try {
      await createEmployee(data);
    } catch (err) {
      console.error(err);
    }
  };

  const columns: ColumnDef<Employee>[] = [
    { 
      key: 'personal_id', 
      label: t('employees.table.id', 'hr'), 
      width: 100,
      render: (emp) => <span className="font-mono font-bold text-primary">{emp.personal_id}</span>
    },
    { 
      key: 'full_name', 
      label: t('employees.table.name', 'hr'), 
      width: 200,
      render: (emp) => <span className="font-bold group-hover:text-primary transition-colors">{emp.full_name}</span>
    },
    { key: 'job_title', label: t('employees.table.position', 'hr'), width: 150 },
    { key: 'org_level_1', label: t('employees.table.department', 'hr'), width: 150 },
    { key: 'contract_nature', label: t('employees.table.contract', 'hr'), width: 150 },
    { key: 'date_of_appointment', label: t('employees.table.date', 'hr'), width: 150 },
    { 
      key: 'status', 
      label: t('employees.table.status', 'hr'), 
      width: 100,
      render: (emp) => (
        <span className={`px-2 py-1 rounded text-xs font-bold transition-all duration-300 group-hover:scale-110 inline-block ${
          emp.status === 'active' ? 'bg-success/20 text-success' : 'bg-text-muted/20 text-text-muted'
        }`}>
          {t(`employees.values.${emp.status}`, 'hr')}
        </span>
      )
    },
  ];

  // Calculate paginated data
  const totalPages = Math.ceil(employees.length / pageSize);
  const paginatedEmployees = employees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-card p-4 rounded-lg shadow-sm border border-border transform transition-all duration-500 hover:shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-primary">{t('employees.title', 'hr')}</h1>
          <p className="text-sm text-text-muted mt-1">{t('employees.subtitle', 'hr')}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="primary" className="flex items-center gap-1 shadow-lg shadow-primary/20">
          <Plus size={18} />
          {t('employees.add', 'hr')}
        </Button>
      </div>

      {error && (
        <div className="bg-danger/10 text-danger p-4 rounded-lg text-sm border border-danger/20 animate-shake">
          {error}
        </div>
      )}

      {isLoading && employees.length === 0 ? (
        <div className="bg-card rounded-lg p-8 text-center text-text-muted border border-border">
          {t('common.loading', 'shared') !== 'common.loading' ? t('common.loading', 'shared') : 'جاري تحميل البيانات...'}
        </div>
      ) : (
        <div className="space-y-4">
          <ResizableTable columns={columns} data={paginatedEmployees} />
          
          <div className="flex justify-between items-center bg-card p-3 rounded-lg border border-border">
            <div className="text-xs text-text-muted">
              {t('employees.table.count', 'hr')
                .replace('{count}', paginatedEmployees.length.toString())
                .replace('{total}', employees.length.toString())}
            </div>
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </div>
      )}

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}
