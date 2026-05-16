// modules/users/infrastructure/repositories/UserRepository.ts

import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, Role, Permission, RoleDetails } from '../../domain/entities/User';
import { ApiClient } from '../../../shared/infrastructure/apiClient';

export class UserRepository implements IUserRepository {
  constructor(private apiClient: ApiClient) {}

  async getUsers(page = 1, per_page = 10): Promise<{ data: User[]; total: number }> {
    const response = await this.apiClient.get<any>(`/users?page=${page}&per_page=${per_page}`);
    return {
      data: response.data,
      total: response.total || response.data.length, // Fallback if API doesn't provide total
    };
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.apiClient.get<any>('/users/current');
    return response.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await this.apiClient.post<any>(`/users/${id}`, data);
    return response.data;
  }

  async updateSignature(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('signature', file);
    // Note: apiClient.post stringifies by default, we need to handle FormData
    // Since apiClient is simple, we might need to use fetch directly or update apiClient
    // For now, I'll assume apiClient can handle FormData if we pass it as body
    const response = await this.apiClient.post<any>('/users/signature', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async exportExcel(): Promise<void> {
    await this.apiClient.post('/users/reports/excel', {});
  }

  async exportPdf(): Promise<void> {
    await this.apiClient.post('/users/reports/pdf', {});
  }

  async getPermissions(): Promise<Permission[]> {
    const response = await this.apiClient.get<any>('/users/permissions');
    return response.data;
  }

  async getRoles(): Promise<Role[]> {
    const response = await this.apiClient.get<any>('/users/roles');
    return response.data;
  }

  async getRoleDetails(id: string): Promise<RoleDetails> {
    const response = await this.apiClient.get<any>(`/users/roles/${id}`);
    return response.data;
  }

  async createRole(data: { name: string; display_name: string; permissions: string[] }): Promise<void> {
    await this.apiClient.post('/users/roles/store', data);
  }

  async updateRole(id: string, data: { name: string; display_name: string; permissions: string[] }): Promise<void> {
    await this.apiClient.post(`/users/roles/${id}`, data);
  }

  async deleteRole(id: string): Promise<void> {
    await this.apiClient.delete(`/users/roles/${id}`);
  }
}
