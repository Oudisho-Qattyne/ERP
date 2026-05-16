import { CrudRepository } from "../../../shared/domain/repositories/CrudRepository";
import { Employee } from "../entities/Employee";

export interface IEmployeeRepository extends CrudRepository<Employee> {
  // Additional HR-specific repository methods can be added here
}
