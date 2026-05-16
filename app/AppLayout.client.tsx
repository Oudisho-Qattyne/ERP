'use client';

import { getHideSidebarPaths, navItems } from '@/modules/generated/navigation';
import { Sidebar } from '@/modules/shared/presentation/components/ui/layout/Sidebar';
import { TopBar } from '@/modules/shared/presentation/components/ui/layout/TopBar';
import { SidebarProvider } from '@/modules/shared/presentation/context/SidebarContext';
import { DynamicIcon } from '@/modules/shared/presentation/components/ui/icons/DynamicIcon';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useLanguage } from '@/modules/shared/presentation/context/LanguageContext';

interface AppLayoutClientProps {
  children: React.ReactNode;
}

// Mock user – replace with actual auth context
const mockUser = {
  full_name: 'م. أحمد الشمري',
  position: 'المدير العام',
  role: 'admin',
};

// Helper to check if current path matches any pattern (supports '*' wildcard)
function matchesPath(pathname: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    // Convert pattern to regex: escape regex special chars, then replace '\*' with '.*'
    const regexPattern = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\\\*/g, '.*');
    const regex = new RegExp(`^${regexPattern}$`);
    if (regex.test(pathname)) return true;
  }
  return false;
}

export function AppLayoutClient({ children }: AppLayoutClientProps) {
  const pathname = usePathname() || '';
  const { direction, t } = useLanguage();
  const hiddenPaths = getHideSidebarPaths();

  if (matchesPath(pathname, hiddenPaths)) {
    return <>{children}</>;
  }

  const { title, icon } = useMemo(() => {
    const activeItem = navItems.find(item => item.href === pathname);

    if (activeItem) {
      // Map navigation labels to their title keys in the module
      const titleKey = `navigation.${activeItem.label}`;
      const translatedTitle = t(titleKey, activeItem.group || 'shared');
      
      return {
        title: translatedTitle !== titleKey ? translatedTitle : activeItem.label,
        icon: <DynamicIcon name={activeItem.icon} size={20} className="text-primary" />
      };
    }

    // Fallback logic
    const segments = pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1] || 'dashboard';
    const capitalized = last.charAt(0).toUpperCase() + last.slice(1);

    return {
      title: capitalized,
      icon: <DynamicIcon name="LayoutDashboard" size={20} className="text-primary" />
    };
  }, [pathname, t]);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background" dir={direction}>
        <Sidebar user={mockUser} unreadNotifications={2} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar
            title={title}
            icon={icon}
            unreadNotifications={2}
            onNotificationClick={() => alert('Notifications clicked')}
            user={mockUser}
          />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
