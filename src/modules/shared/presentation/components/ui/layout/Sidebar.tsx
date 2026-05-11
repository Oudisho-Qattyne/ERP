// src/components/layout/Sidebar.tsx
'use client';

import { NavGroupItem } from './NavGroupItem';
import { UserInfo } from './UserInfo';
import { CollapseButton } from './CollapseButton';
import { LogoutButton } from './LogoutButton';
import { useNavigation } from '../../../hooks/useNavigation';
import { useSidebar } from '../../../context/SidebarContext';

interface SidebarProps {
  user: {
    full_name: string;
    position?: string;
    role: string;
  };
  unreadNotifications?: number;
}

export function Sidebar({ user, unreadNotifications = 0 }: SidebarProps) {
  const { collapsed } = useSidebar();
  const { navItems, navGroups } = useNavigation(user?.role);

  // Group navigation items by group
  const grouped = navGroups
    .map((group) => ({
      ...group,
      items: navItems.filter((item) => item.group === group.id),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <aside
      className={`
        flex flex-col h-screen bg-linear-to-b from-primary-dark via-primary to-primary-dark
        transition-all duration-250 ease-in-out border-l border-gold/20 shrink-0
        ${collapsed ? 'w-16' : 'w-56'}
      `}
    >
      {/* Logo / Header */}
      <div
        className={`
          flex items-center border-b border-white/10 py-3
          ${collapsed ? 'justify-center px-0' : 'gap-2 px-4'}
        `}
      >
        <div className="w-8 h-8 rounded-md bg-linear-to-br from-gold to-gold-dark flex items-center justify-center text-lg font-black text-primary-dark shadow-md">
          🦅
        </div>
        {!collapsed && (
          <div>
            <div className="text-xs font-extrabold text-white tracking-wide">حسياء</div>
            <div className="text-[8px] text-white/40">نظام الإدارة الموحد</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {grouped.map((group) => (
          <NavGroupItem
            key={group.id}
            group={group}
            collapsed={collapsed}
            unreadCount={group.id === 'adm' ? unreadNotifications : 0}
          />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-white/10 pt-2 pb-3 px-2 space-y-2">
        <UserInfo user={user} collapsed={collapsed} />
        <LogoutButton collapsed={collapsed} />
        <CollapseButton />
      </div>
    </aside>
  );
}