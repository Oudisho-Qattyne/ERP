import { ApiClient } from '../../domain/api/ApiClient';
import { CrudRepository } from '../../domain/repositories/CrudRepository';

export function createBaseCrudRepository<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>, ID = string>(
  apiClient: ApiClient,
  resourcePath: string
): CrudRepository<T, CreateDTO, UpdateDTO, ID> {
  
  return {
    findAll: async (): Promise<T[]> => {
      return apiClient.get<T[]>(resourcePath);
    },

    findById: async (id: ID): Promise<T | null> => {
      return apiClient.get<T>(`${resourcePath}/${id}`);
    },

    create: async (data: CreateDTO): Promise<T> => {
      return apiClient.post<T, CreateDTO>(resourcePath, data);
    },

    update: async (id: ID, data: UpdateDTO): Promise<T> => {
      return apiClient.put<T, UpdateDTO>(`${resourcePath}/${id}`, data);
    },

    delete: async (id: ID): Promise<void> => {
      return apiClient.delete<void>(`${resourcePath}/${id}`);
    }
  };
}
