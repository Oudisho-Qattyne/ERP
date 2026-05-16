'use client';

import React, { useEffect, useState } from 'react';
import { User } from '../../domain/entities/User';
import { GetUsersUseCase } from '../../application/usecases/GetUsersUseCase';
import { useRepository } from '../../../shared/infrastructure/InfrastructureProvider';
import { useLanguage } from '../../../shared/presentation/context/LanguageContext';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { ResizableTable } from '@/modules/shared/presentation/components/ui/tables/ResizableTable';

export default function UserListPage() {
  const { t, direction } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Use the repository from context
  const factory = useRepository('users');
  // Note: factory.createRepository usually returns a generic repository.
  // For specialized DDD, we might need to instantiate the UserRepository manually or via factory.
  // Given the existing shared structure, I'll assume we can get the apiClient.

  // For this demonstration, I'll instantiate the usecase with a repository.
  // In a real app, this might be provided via a DI container or a custom hook.

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Mocking the injection for now as the factory might not be set up for 'users' yet
        // In a real scenario, we'd use the factory: const repo = factory.createRepository('users');
        // For now, I'll use a placeholder logic
        const response = await fetch('/api/v1/users');
        const json = await response.json();
        setUsers(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    { key: 'name', label: t('name', 'shared'), width: 200 },
    { key: 'email', label: t('email', 'shared'), width: 250 },
    { key: 'role', label: t('role', 'shared'), width: 150, render: (u: User) => u.role.display_name },
    // {
    //   key: 'status', label: t('status', 'users'), width: 120, render: (u: User) => <span className={`px-2 py-1 rounded-full text-xs ${u.status === 'active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
    //     {t(`users:status.${u.status}`, 'shared')}
    //   </span>

    // },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-text">{t('title', 'shared')}</h1>
      </div>

      <ResizableTable
        columns={columns}
        data={users}
      />
    </div>
  );
}
