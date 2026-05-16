import LoginPage from "./components/Login";

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}

export const routes: RouteConfig[] = [
  { path: '', component: LoginPage, exact: true },
];
