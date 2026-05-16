// Auto-generated from modules/*/presentation/navigation.ts
// Do not edit manually. Changes will be overwritten.

export const navItems = [
  {
    "id": "login",
    "label": "تسجيل الدخول",
    "icon": "Lock",
    "group": "",
    "href": "/auth"
  },
  {
    "id": "hr-dashboard",
    "label": "dashboard",
    "icon": "LayoutDashboard",
    "group": "hr",
    "href": "/hr/dashboard"
  },
  {
    "id": "hr-employees",
    "label": "employees",
    "icon": "Users",
    "group": "hr",
    "href": "/hr/employees"
  },
  {
    "id": "hr-reports",
    "label": "reports",
    "icon": "BarChart3",
    "group": "hr",
    "href": "/hr/reports"
  },
  {
    "id": "list",
    "label": "navigation.list",
    "href": "/users",
    "icon": {},
    "group": "users"
  },
  {
    "id": "roles",
    "label": "navigation.roles",
    "href": "/users/roles",
    "icon": {},
    "group": "users"
  }
];

export const navGroups = [
  {
    "id": "hr",
    "label": "hr",
    "order": 1
  },
  {
    "id": "users",
    "label": "navigation.users",
    "order": 1
  }
];

export const hideSidebarPaths = [
  "/auth*"
];

export function getAllNavItems() {
  return navItems;
}

export function getAllNavGroups() {
  return navGroups;
}

export function getHideSidebarPaths() {
  return hideSidebarPaths;
}
