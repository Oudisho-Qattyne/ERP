import { navItems as generatedNavItems, navGroups as generatedNavGroups } from './../modules/generated/navigation';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  group: string;
  href: string;
  permission?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  order?: number;
}

export const getAllNavItems = () => generatedNavItems;
export const getAllNavGroups = () => generatedNavGroups;