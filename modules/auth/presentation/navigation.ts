import { ModuleConfig, NavGroup, NavItem } from "../../registry";

export const navGroups: NavGroup[] = [];

export const navItems: NavItem[] = [
  {
    id: 'login',
    label: 'تسجيل الدخول',
    icon: 'Lock',
    group: '',
    href: '/auth',
  },
];

export const config: ModuleConfig = {
  hideSidebarPaths: [
    '/auth*'
  ],
};
