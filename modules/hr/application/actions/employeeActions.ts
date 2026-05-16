"use server";

import { createJsonEmployeeRepository } from "../../infrastructure/repositories/JsonEmployeeRepository";
import { createEmployeeUseCases } from "../useCases/employeeUseCases";
import { Employee } from "../../domain/entities/Employee";

import path from 'path';

// Instantiate repository and use cases on the server
// We use path.join(process.cwd()) to ensure we are in the project root
const repository = createJsonEmployeeRepository(path.join(process.cwd(), 'data', 'employees.json'));
const useCases = createEmployeeUseCases(repository);

export async function getEmployeesAction() {
  return await useCases.getAll();
}

export async function getEmployeeByIdAction(id: string) {
  return await useCases.getById(id);
}

export async function createEmployeeAction(data: Omit<Employee, "id">) {
  return await useCases.create(data);
}

export async function updateEmployeeAction(id: string, data: Partial<Employee>) {
  return await useCases.update(id, data);
}

export async function deleteEmployeeAction(id: string) {
  return await useCases.delete(id);
}
