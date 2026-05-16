'use client';

import React from 'react';
import UserListPage from './pages/UserListPage';
import RoleListPage from './pages/RoleListPage';

interface UsersModuleProps {
  subPath?: string[];
}

export default function UsersModule({ subPath }: UsersModuleProps) {
  const path = subPath?.[0] || 'list';

  switch (path) {
    case 'roles':
      return <RoleListPage />;
    case 'list':
    default:
      return <UserListPage />;
  }
}