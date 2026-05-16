'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { createApiClient } from './apiClient';
import { createRepositoryFactory, RepositoryFactory, RepositoryType } from './repositoryFactory';
import { Entity } from './types';

// Your auth helpers (implement them as needed)
const getAccessToken = async () => localStorage.getItem('access_token');
const refreshToken = async () => {
  const res = await fetch('/api/auth/refresh', { method: 'POST' });
  const { token } = await res.json();
  localStorage.setItem('access_token', token);
  return token;
};
const onUnauthorized = () => {
  localStorage.removeItem('access_token');
  window.location.href = '/login';
};

const InfrastructureContext = createContext<RepositoryFactory | null>(null);

export function InfrastructureProvider({ children }: { children: React.ReactNode }) {
  const apiClient = useMemo(
    () =>
      createApiClient({
        baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
        getAccessToken,
        refreshToken,
        onUnauthorized,
      }),
    []
  );

  const factory = useMemo(() => {
    const f = createRepositoryFactory('rest');
    f.setApiClient(apiClient);
    return f;
  }, [apiClient]);

  return (
    <InfrastructureContext.Provider value={factory}>
      {children}
    </InfrastructureContext.Provider>
  );
}

export function useRepository<T extends Entity>(entityName: string, type?: RepositoryType) {
  const factory = useContext(InfrastructureContext);
  if (!factory) throw new Error('InfrastructureProvider missing');
  return factory.createRepository<T>(entityName, type);
}