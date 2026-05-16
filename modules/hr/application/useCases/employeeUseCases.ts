import { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import { Employee } from "../../domain/entities/Employee";

export const createEmployeeUseCases = (repository: IEmployeeRepository) => {
  return {
    getAll: async (): Promise<Employee[]> => {
      return repository.findAll();
    },
    getById: async (id: string): Promise<Employee | null> => {
      return repository.findById(id);
    },
    create: async (data: Omit<Employee, "id">): Promise<Employee> => {
      const newEmployee = { ...data, id: Date.now().toString() } as Employee;
      return repository.create(newEmployee);
    },
    update: async (id: string, data: Partial<Employee>): Promise<Employee> => {
      return repository.update(id, data);
    },
    delete: async (id: string): Promise<void> => {
      return repository.delete(id);
    }
  };
};
