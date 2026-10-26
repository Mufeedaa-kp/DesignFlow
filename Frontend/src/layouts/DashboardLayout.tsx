import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navbar/NavBar";
import type { NavLink } from "../shared/constants/navLinks";

interface DashboardLayoutProps {
  links: NavLink[];
  title: string;
}

const DashboardLayout = ({ links, title }: DashboardLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-panel/30">
      <Sidebar links={links} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main
          data-scroll-container
          className="flex-1 overflow-y-auto p-4 sm:p-6"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;