// src/components/layout/TopBar.tsx
'use client';

import { Menu } from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';

interface TopBarProps {
  title: string;
  icon?: string;
  unreadNotifications?: number;
  onNotificationClick?: () => void;
  user: {
    full_name: string;
    position?: string;
    role: string;
  };
}

export function TopBar({
  title,
  icon = '📊',
  unreadNotifications = 0,
  onNotificationClick,
  user,
}: TopBarProps) {
  const { toggleCollapsed } = useSidebar();

  return (
    <header className="bg-card border-b border-border h-14 px-5 flex items-center justify-between shrink-0">
      {/* Left side: mobile menu toggle + page title */}
      <div className="flex items-center gap-3">
        {/* Hamburger button for mobile (visible only on small screens) */}
        <button
          onClick={toggleCollapsed}
          className="lg:hidden p-1 rounded-md hover:bg-primary-light transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} className="text-text" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-gold rounded-full" />
          <h1 className="text-base font-extrabold text-text">
            {icon && <span className="ml-1">{icon}</span>}
            {title}
          </h1>
        </div>
      </div>

      {/* Right side: notifications + user info */}
      <div className="flex items-center gap-4">
        {/* Notifications button */}
        {onNotificationClick && (
          <button
            onClick={onNotificationClick}
            className="relative p-1.5 rounded-md hover:bg-primary-light transition-colors"
            aria-label="الإشعارات"
          >
            <span className="text-lg">🔔</span>
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </button>
        )}

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md  bg-primary  flex items-center justify-center text-white text-sm font-bold shadow">
            {user.full_name?.[0] === 'م'
              ? user.full_name?.[2] || user.full_name[0]
              : user.full_name?.[0] || 'U'}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-text">{user.full_name}</div>
            <div className="text-[10px] text-text-muted">
              {user.position || (user.role === 'admin' ? 'مدير عام' : 'موظف')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}