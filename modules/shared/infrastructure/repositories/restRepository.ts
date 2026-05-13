// src/infrastructure/repositories/restRepository.ts
import { ApiClient } from '../apiClient';
import { Entity, ListParams, ListResponse, Repository } from '../types';

export function createRestRepository<T extends Entity>(
  apiClient: ApiClient,
  endpoint: string
): Repository<T> {
  return {
    async getList(params?: ListParams): Promise<ListResponse<T>> {
      const searchParams = new URLSearchParams();
      if (params) {
        if (params.page) searchParams.append('page', String(params.page));
        if (params.limit) searchParams.append('limit', String(params.limit));
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
        if (params.filters) {
          Object.entries(params.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') searchParams.append(key, String(value));
          });
        }
      }
      const query = searchParams.toString();
      const url = query ? `${endpoint}?${query}` : endpoint;
      return apiClient.get<ListResponse<T>>(url);
    },

    async getById(id: string | number): Promise<T | null> {
      try {
        return await apiClient.get<T>(`${endpoint}/${id}`);
      } catch {
        return null;
      }
    },

    async create(data: Omit<T, 'id'>): Promise<T> {
      return apiClient.post<T>(endpoint, data);
    },

    async update(id: string | number, data: Partial<T>): Promise<T> {
      return apiClient.patch<T>(`${endpoint}/${id}`, data);
    },

    async delete(id: string | number): Promise<void> {
      await apiClient.delete(`${endpoint}/${id}`);
    },
  };
}