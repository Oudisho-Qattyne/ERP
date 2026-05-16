import { useState, useEffect } from 'react';
import { Employee } from '../../domain/entities/Employee';
import { 
  getEmployeesAction, 
  createEmployeeAction, 
  updateEmployeeAction, 
  deleteEmployeeAction 
} from '../../application/actions/employeeActions';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await getEmployeesAction();
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || 'فشل جلب الموظفين');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const createEmployee = async (data: Omit<Employee, "id">) => {
    setIsLoading(true);
    try {
      const newEmp = await createEmployeeAction(data);
      setEmployees((prev) => [...prev, newEmp]);
      return newEmp;
    } catch (err: any) {
      setError(err.message || 'فشل إضافة الموظف');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployee = async (id: string, data: Partial<Employee>) => {
    setIsLoading(true);
    try {
      const updated = await updateEmployeeAction(id, data);
      setEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)));
      return updated;
    } catch (err: any) {
      setError(err.message || 'فشل تحديث الموظف');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteEmployeeAction(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      setError(err.message || 'فشل حذف الموظف');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    employees,
    isLoading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
