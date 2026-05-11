import { NavGroup, NavItem } from "../../registry";

export const navGroups: NavGroup[] = [
  { id: 'crm', label: 'إدارة علاقات المستثمرين', order: 2 },
];

export const navItems: NavItem[] = [
  {
    id: 'login',
    label: 'تسجيل الدخول',
    icon: '🏢',
    group: 'crm',
    href: '/users',
  },
//   {
//     id: 'pipeline',
//     label: 'فرص الاستثمار',
//     icon: '📈',
//     group: 'crm',
//     href: '/pipeline',
//   },
];