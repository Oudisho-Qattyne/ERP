import React from 'react';
import { EmployeesPage } from './pages/EmployeesPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReportsPage } from './pages/ReportsPage';

export interface RouteConfig {
  path: string;          // e.g., '', 'create', ':id', ':id/edit'
  component: React.ComponentType<any>;
  exact?: boolean;
}

export const hrRoutes: RouteConfig[] = [
  { path: '', component: DashboardPage, exact: true },
  { path: 'dashboard', component: DashboardPage, exact: true },
  { path: 'employees', component: EmployeesPage, exact: true },
  { path: 'reports', component: ReportsPage, exact: true },
];
