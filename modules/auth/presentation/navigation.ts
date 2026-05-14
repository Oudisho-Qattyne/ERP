import { ModuleConfig, NavGroup, NavItem } from "../../registry";

export const navGroups: NavGroup[] = [];

export const navItems: NavItem[] = [
  {
    id: 'login',
    label: 'تسجيل الدخول',
    icon: '🔐',
    group: '',
    href: '/auth',
  },
];

export const config: ModuleConfig = {
  hideSidebarPaths: [
    '/auth*'
  ],
};
