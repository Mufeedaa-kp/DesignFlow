import { NavLink as RouterNavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  label: string;
  to: string;
  icon: LucideIcon;
  collapsed: boolean;
  onNavigate?: () => void;
}

const SidebarItem = ({ label, to, icon: Icon, collapsed, onNavigate }: SidebarItemProps) => {
  return (
    <RouterNavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
          isActive ? "bg-charcoal text-cream" : "text-muted hover:bg-panel hover:text-charcoal"
        } ${collapsed ? "justify-center" : ""}`
      }
      title={collapsed ? label : undefined}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span>{label}</span>}
    </RouterNavLink>
  );
};

export default SidebarItem;