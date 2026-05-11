'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear auth state, redirect to login
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className={`
        flex items-center gap-2 text-danger hover:bg-danger/10 rounded-md transition-all
        ${collapsed ? 'justify-center py-2 px-0' : 'px-3 py-2 justify-start'}
      `}
    >
      <span className="text-base">🚪</span>
      {!collapsed && <span className="text-sm font-semibold">خروج</span>}
    </button>
  );
}