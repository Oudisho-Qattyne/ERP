// src/infrastructure/types.ts
export interface Entity {
    id: string | number;
    [key: string]: any;
  }
  
  export interface ListParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, any>;
  }
  
  export interface ListResponse<T extends Entity> {
    data: T[];
    total: number;
    page: number;
    limit: number;
  }
  
  export interface Repository<T extends Entity> {
    getList(params?: ListParams): Promise<ListResponse<T>>;
    getById(id: string | number): Promise<T | null>;
    create(data: Omit<T, 'id'>): Promise<T>;
    update(id: string | number, data: Partial<T>): Promise<T>;
    delete(id: string | number): Promise<void>;
  }