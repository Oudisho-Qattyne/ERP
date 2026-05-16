'use client';

import { routes } from './routes';
import ModuleRouter from '../../shared/presentation/ModuleRouter';

interface AuthModuleProps {
  subPath?: string[];
}

export default function AuthModule({ subPath = [] }: AuthModuleProps) {
  return <ModuleRouter routes={routes} subPath={subPath} />;
}
