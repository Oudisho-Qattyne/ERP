// modules/users/presentation/navigation.ts

import { Users, ShieldCheck, List } from 'lucide-react';



export const navItems = [
  {
    id: 'list',
    label: 'navigation.list',
    href: '/users',
    icon: List,
    group: 'users',

  },
  {
    id: 'roles',
    label: 'navigation.roles',
    href: '/users/roles',
    icon: ShieldCheck,
    group: 'users',

  },

];

export const navGroups = [
  {
    id: 'users',
    label: 'navigation.users',
    order: 1,
  },
];

// export const usersNavigation = {
//   key: 'users',
//   title: 'navigation.users',
//   icon: Users,
//   items: [
//     {
//       key: 'list',
//       title: 'navigation.list',
//       path: '/users',
//       icon: List,
//     },
//     {
//       key: 'roles',
//       title: 'navigation.roles',
//       path: '/users/roles',
//       icon: ShieldCheck,
//     },
//   ],
// };