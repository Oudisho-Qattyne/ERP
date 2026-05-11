'use client';

import { Sidebar } from '@/src/modules/shared/presentation/components/ui/layout/Sidebar';
import { SidebarProvider } from '@/src/modules/shared/presentation/context/SidebarContext';
import { usePathname } from 'next/navigation';

interface AppLayoutClientProps {
  children: React.ReactNode;
}

// Mock user – replace with actual auth context
const mockUser = {
  full_name: 'م. أحمد الشمري',
  position: 'المدير العام',
  role: 'admin',
};

export function AppLayoutClient({ children }: AppLayoutClientProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background" dir="rtl">
        <Sidebar user={mockUser}  />
        <main className="flex-1 overflow-auto ">{children}</main>
      </div>
    </SidebarProvider>
  );
}