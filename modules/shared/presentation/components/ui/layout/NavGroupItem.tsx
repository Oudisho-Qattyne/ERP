'use client';

import { NavGroup, NavItem } from '@/modules/registry';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavGroupItemProps {
  group: NavGroup & { items: NavItem[] };
  collapsed: boolean;
  unreadCount?: number;
}

export function NavGroupItem({ group, collapsed, unreadCount = 0 }: NavGroupItemProps) {
  // For the "main" group (dashboard) we don't show a label
  const showLabel = group.label && group.id !== 'main';

  return (
    <div className="mb-2">
      {/* Group header (only when expanded) */}
      {!collapsed && showLabel && (
        <div className="text-[8px] font-bold text-white/20 px-3 pt-3 pb-1 uppercase tracking-wider">
          {group.label}
        </div>
      )}
      {/* Separator line when collapsed and group has label */}
      {collapsed && showLabel && <div className="h-px bg-white/10 my-2 mx-2" />}

      {/* Group items */}
      {group.items.map((item) => (
        <NavItemLink
          key={item.id}
          item={item}
          collapsed={collapsed}
          unread={item.id === 'notifications' ? unreadCount : undefined}
        />
      ))}
    </div>
  );
}

// Internal component for a single nav link
function NavItemLink({
  item,
  collapsed,
  unread,
}: {
  item: NavItem;
  collapsed: boolean;
  unread?: number;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

  return (
    <Link
      href={item.href}
      className={`
        flex items-center gap-2 rounded-md transition-all duration-150 relative
        ${collapsed ? 'justify-center py-2 px-0' : 'px-3 py-2 justify-start'}
        ${isActive 
          ? 'bg-gold/10 text-gold border-r-2 border-gold' 
          : 'text-white/45 hover:bg-white/5 hover:text-white/70'
        }
      `}
      title={collapsed ? item.label : undefined}
    >
      <span className="text-base shrink-0">{item.icon}</span>
      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
      {unread && unread > 0 && (
        <span className={`
          absolute top-1 w-2 h-2 rounded-full bg-danger border-2 border-primary-dark
          ${collapsed ? 'left-7' : 'left-auto -right-2'}
        `} />
      )}
    </Link>
  );
}