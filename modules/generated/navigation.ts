// Auto-generated from modules/*/presentation/navigation.ts
// Do not edit manually. Changes will be overwritten.

export const navItems = [
  {
    "id": "login",
    "label": "تسجيل الدخول",
    "icon": "🔐",
    "group": "",
    "href": "/auth"
  }
];

export const navGroups = [
  {
    "id": "crm",
    "label": "إدارة علاقات المستثمرين",
    "order": 2
  }
];

export const hideSidebarPaths = [
  "/auth*",
  "/users/*"
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
