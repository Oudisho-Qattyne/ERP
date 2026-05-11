import { useSidebar } from "../../../context/SidebarContext";

export function CollapseButton() {
  const { collapsed, toggleCollapsed } = useSidebar();
  return (
    <button
      onClick={toggleCollapsed}
      className="w-full mt-2 py-1 text-white/30 hover:text-white/60 text-sm transition-colors"
    >
      {collapsed ? '→' : '←'}
    </button>
  );
}