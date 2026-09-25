import { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import SidebarMenu from "./SidebarMenu";
import type { NavLink } from "../../shared/constants/navLinks";

interface SidebarProps {
  links: NavLink[];
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const Sidebar = ({
  links,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-black/40 sm:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 h-screen w-60 shrink-0 flex flex-col border-r border-border bg-cream transition-all duration-200 sm:static
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0
          ${collapsed ? "sm:w-19" : "sm:w-60"}`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          {!collapsed && (
            <p className="font-serif text-lg font-bold text-charcoal">
              DesignFlow
            </p>
          )}

          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden text-muted transition-colors hover:text-charcoal sm:block"
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
          >
            <ChevronLeft
              size={18}
              className={`transition-transform duration-200 ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>

          <button
            onClick={onCloseMobile}
            className="text-muted transition-colors hover:text-charcoal sm:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <SidebarMenu
          links={links}
          collapsed={collapsed}
          onNavigate={onCloseMobile}
        />
      </aside>
    </>
  );
};

export default Sidebar;