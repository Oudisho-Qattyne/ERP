// src/infrastructure/repositories/memoryRepository.ts
import { Entity, ListParams, ListResponse, Repository } from '../types';

export function createMemoryRepository<T extends Entity>(
  initialData: T[] = [],
  persistKey?: string
): Repository<T> {
  let storage = new Map<string | number, T>();
  let nextId = 1;

  const saveToStorage = () => {
    if (persistKey && typeof localStorage !== 'undefined') {
      const data = Array.from(storage.values());
      localStorage.setItem(persistKey, JSON.stringify(data));
    }
  };

  const getStorageKey = (id: string | number) => String(id);

  // Initialize
  initialData.forEach(item => {
    const id = item.id ?? nextId++;
    storage.set(getStorageKey(id), { ...item, id });
  });

  if (persistKey && typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(persistKey);
    if (stored) {
      const data = JSON.parse(stored) as T[];
      storage.clear();
      data.forEach(item => {
        const id = item.id ?? nextId++;
        storage.set(getStorageKey(id), { ...item, id });
      });
      nextId = Math.max(nextId, ...Array.from(storage.keys()).map(k => Number(k) || 0)) + 1;
    }
  }

  return {
    async getList(params?: ListParams): Promise<ListResponse<T>> {
      let items = Array.from(storage.values());
      if (params?.filters) {
        items = items.filter(item =>
          Object.entries(params.filters!).every(([key, value]) => item[key] === value)
        );
      }
      if (params?.sortBy) {
        const { sortBy, sortOrder = 'asc' } = params;
        items.sort((a, b) => {
          const aVal = a[sortBy];
          const bVal = b[sortBy];
          if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      const total = items.length;
      const page = params?.page || 1;
      const limit = params?.limit || total;
      const start = (page - 1) * limit;
      const data = items.slice(start, start + limit);
      return { data, total, page, limit };
    },

    async getById(id: string | number): Promise<T | null> {
      return storage.get(getStorageKey(id)) || null;
    },

    async create(data: Omit<T, 'id'>): Promise<T> {
      const id = nextId++;
      const newItem = { ...data, id } as T;
      storage.set(getStorageKey(id), newItem);
      saveToStorage();
      return newItem;
    },

    async update(id: string | number, data: Partial<T>): Promise<T> {
      const existing = await this.getById(id);
      if (!existing) throw new Error('Not found');
      const updated = { ...existing, ...data };
      storage.set(getStorageKey(id), updated);
      saveToStorage();
      return updated;
    },

    async delete(id: string | number): Promise<void> {
      storage.delete(getStorageKey(id));
      saveToStorage();
    },
  };
}