// src/modules/investors/presentation/routes.ts

import City from "./components/City";

export interface RouteConfig {
    path: string;
    component: React.ComponentType<any>; // ✅ type, not value
    exact?: boolean;
  }

export const routes: RouteConfig[] = [
  {path:'select' , component:City, exact:true}
];