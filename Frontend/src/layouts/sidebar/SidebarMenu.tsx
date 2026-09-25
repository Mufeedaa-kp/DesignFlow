import SidebarItem from "./SidebarItem";
import type { NavLink } from "../../shared/constants/navLinks";

interface SidebarMenuProps {
  links: NavLink[];
  collapsed: boolean;
  onNavigate?: () => void;
}

const SidebarMenu = ({ links, collapsed, onNavigate }: SidebarMenuProps) => {
  return (
    <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
      {links.map((link) => (
        <SidebarItem key={link.to} {...link} collapsed={collapsed} onNavigate={onNavigate} />
      ))}
    </nav>
  );
};

export default SidebarMenu;