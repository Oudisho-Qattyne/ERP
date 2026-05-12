// Export the actual page component (not a lazy wrapper)
// export { default } from './components/Login';

'use client';

import { routes } from './routes';
import ModuleRouter from '../../shared/presentation/ModuleRouter';

interface InvestorsModuleProps {
  subPath?: string[];
}

export default function InvestorsModule({ subPath = [] }: InvestorsModuleProps) {
  return <ModuleRouter routes={routes} subPath={subPath} />;
}