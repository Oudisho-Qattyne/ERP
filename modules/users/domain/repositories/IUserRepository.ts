// modules/users/domain/repositories/IUserRepository.ts

import { User, Role, Permission, RoleDetails } from '../entities/User';

export interface IUserRepository {
  getUsers(page?: number, perPage?: number): Promise<{ data: User[]; total: number }>;
  getCurrentUser(): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  updateSignature(file: File): Promise<User>;
  exportExcel(): Promise<void>;
  exportPdf(): Promise<void>;
  
  // Roles & Permissions
  getPermissions(): Promise<Permission[]>;
  getRoles(): Promise<Role[]>;
  getRoleDetails(id: string): Promise<RoleDetails>;
  createRole(data: { name: string; display_name: string; permissions: string[] }): Promise<void>;
  updateRole(id: string, data: { name: string; display_name: string; permissions: string[] }): Promise<void>;
  deleteRole(id: string): Promise<void>;
}
