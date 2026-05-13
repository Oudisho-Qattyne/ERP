// src/infrastructure/repositoryFactory.ts
import { ApiClient } from './apiClient';
import { Repository, Entity } from './types';
import { createRestRepository } from './repositories/restRepository';
import { createMemoryRepository } from './repositories/memoryRepository';

export type RepositoryType = 'rest' | 'memory';

export interface RepositoryFactory {
    setApiClient(client: ApiClient): void;
    createRepository<T extends Entity>(entityName: string, type?: RepositoryType): Repository<T>;
}

export function createRepositoryFactory(defaultType: RepositoryType = 'rest'): RepositoryFactory {
    let apiClient: ApiClient | null = null;
    const repositories = new Map<string, Repository<any>>();

    return {
        setApiClient(client: ApiClient) {
            apiClient = client;
        },

        createRepository<T extends Entity>(entityName: string, type?: RepositoryType): Repository<T> {
            const key = `${entityName}-${type || defaultType}`;
            if (repositories.has(key)) {
                return repositories.get(key) as Repository<T>;
            }

            const actualType = type || defaultType;
            let repo: Repository<T>;

            if (actualType === 'rest') {
                if (!apiClient) throw new Error('ApiClient not set');
                repo = createRestRepository<T>(apiClient, `/api/${entityName}`);
            } else {
                const persistKey = typeof localStorage !== 'undefined' ? `repo_${entityName}` : undefined;
                repo = createMemoryRepository<T>([], persistKey);
            }

            repositories.set(key, repo);
            return repo;
        }
    };
}