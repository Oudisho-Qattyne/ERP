// src/hooks/useNavigation.ts
'use client';

import { getAllNavGroups, getAllNavItems, NavGroup, NavItem } from '@/modules/registry';
import { useEffect, useState } from 'react';

export function useNavigation(role?: string) {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [navGroups, setNavGroups] = useState<NavGroup[]>([]);

  useEffect(() => {
    let items = getAllNavItems();
    const groups = getAllNavGroups();

    // Filter based on role (optional)
    if (role !== 'admin') {
      items = items.filter((item : NavItem) => item.permission !== 'admin');
    }

    setNavItems(items);
    setNavGroups(groups);
  }, [role]);

  return { navItems, navGroups };
}