// modules/users/application/usecases/ManageRolesUseCase.ts

import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Role, Permission, RoleDetails } from '../../domain/entities/User';

export class ManageRolesUseCase {
  constructor(private userRepository: IUserRepository) {}

  async listRoles(): Promise<Role[]> {
    return this.userRepository.getRoles();
  }

  async listPermissions(): Promise<Permission[]> {
    return this.userRepository.getPermissions();
  }

  async getRole(id: string): Promise<RoleDetails> {
    return this.userRepository.getRoleDetails(id);
  }

  async createRole(data: { name: string; display_name: string; permissions: string[] }): Promise<void> {
    return this.userRepository.createRole(data);
  }

  async updateRole(id: string, data: { name: string; display_name: string; permissions: string[] }): Promise<void> {
    return this.userRepository.updateRole(id, data);
  }

  async deleteRole(id: string): Promise<void> {
    return this.userRepository.deleteRole(id);
  }
}
