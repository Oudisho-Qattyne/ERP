// src/modules/investors/presentation/routes.ts

import LoginPage from "./components/Login";

export interface RouteConfig {
    path: string;
    component: React.ComponentType<any>; // ✅ type, not value
    exact?: boolean;
  }

export const routes: RouteConfig[] = [
  { path: '', component: LoginPage, exact: true },

];