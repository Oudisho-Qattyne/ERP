import fs from 'fs/promises';
import path from 'path';
import { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import { Employee } from "../../domain/entities/Employee";

// This repository uses a local JSON file for persistence.
// Note: This implementation only works in a Node.js environment (server-side).
export const createEmployeeRepository = (filePath?: string): IEmployeeRepository => {
  const dataPath = filePath || path.join(process.cwd(), 'data', 'employees.json');

  const getEmployees = async (): Promise<Employee[]> => {
    try {
      const data = await fs.readFile(dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        // Ensure directory exists
        await fs.mkdir(path.dirname(dataPath), { recursive: true });
        await fs.writeFile(dataPath, JSON.stringify([], null, 2));
        return [];
      }
      throw error;
    }
  };

  const saveEmployees = async (employees: Employee[]): Promise<void> => {
    await fs.writeFile(dataPath, JSON.stringify(employees, null, 2));
  };

  return {
    findAll: async (): Promise<Employee[]> => {
      return await getEmployees();
    },

    findById: async (id: string): Promise<Employee | null> => {
      const employees = await getEmployees();
      return employees.find(e => e.id === id) || null;
    },

    create: async (data: Partial<Employee>): Promise<Employee> => {
      const employees = await getEmployees();
      const newEmployee: Employee = {
        ...data,
        id: data.id || Math.random().toString(36).substr(2, 9),
      } as Employee;
      
      employees.push(newEmployee);
      await saveEmployees(employees);
      return newEmployee;
    },

    update: async (id: string, data: Partial<Employee>): Promise<Employee> => {
      const employees = await getEmployees();
      const index = employees.findIndex(e => e.id === id);
      if (index === -1) throw new Error('Employee not found');
      
      const updatedEmployee = { ...employees[index], ...data };
      employees[index] = updatedEmployee;
      
      await saveEmployees(employees);
      return updatedEmployee;
    },

    delete: async (id: string): Promise<void> => {
      const employees = await getEmployees();
      const filteredEmployees = employees.filter(e => e.id !== id);
      await saveEmployees(filteredEmployees);
    },
  };
};
