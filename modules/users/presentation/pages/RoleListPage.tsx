'use client';

import React, { useEffect, useState } from 'react';
import { Role } from '../../domain/entities/User';
import { useLanguage } from '../../../shared/presentation/context/LanguageContext';
import { ResizableTable } from '../../../shared/presentation/components/ui/tables/ResizableTable';
import { Button } from '../../../shared/presentation/components/ui/buttons/Button';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function RoleListPage() {
  const { t } = useLanguage();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/v1/users/roles');
        const json = await response.json();
        setRoles(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const columns = [
    { key: 'display_name', label: t('users:roles.title', 'shared'), width: 300 },
    { key: 'name', label: 'Key', width: 200 },
    {
      key: 'actions',
      label: t('users:list.actions', 'shared'),
      width: 150,
      render: (role: Role) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" rightIcon={<Edit size={14} />} />
          <Button variant="ghost" size="sm" rightIcon={<Trash2 size={14} className="text-danger" />} />
        </div>
      )
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-text">{t('users:roles.title', 'shared')}</h1>
        <Button variant="primary" leftIcon={<Plus size={16} />}>
          {t('users:roles.new', 'shared')}
        </Button>
      </div>

      <ResizableTable
        columns={columns}
        data={roles}
      // isLoading={loading}
      />
    </div>
  );
}
