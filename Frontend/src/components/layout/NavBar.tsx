import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiSearch, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const NAV_LINKS_BY_ROLE: Record<string, { label: string; to: string }[]> = {
  admin: [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Users", to: "/admin/users" },
    { label: "Projects", to: "/admin/projects" },
    { label: "Analytics", to: "/admin/analytics" },
  ],
  designer: [
    { label: "Dashboard", to: "/designer/dashboard" },
    { label: "Projects", to: "/projects" },
    { label: "Quotations", to: "/quotations" },
    { label: "Meetings", to: "/meetings" },
  ],
  client: [
    { label: "Dashboard", to: "/client/dashboard" },
    { label: "New Project", to: "/new-project" },
    { label: "Quotations", to: "/quotations" },
    { label: "Meetings", to: "/meetings" },
  ],
};

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const role = user?.role ?? "client";
  const navLinks = NAV_LINKS_BY_ROLE[role];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-panel border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link to={`/${role}/dashboard`} className="font-serif font-bold text-lg text-charcoal shrink-0">
          DesignFlow
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-xs uppercase tracking-wide text-muted hover:text-amber transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center flex-1 max-w-xs">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
            <input
              placeholder="Search..."
              className="w-full bg-white border border-border rounded-full pl-9 pr-3 py-2
                         text-xs text-charcoal placeholder:text-muted/70 focus:outline-none
                         focus:border-amber transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Link
            to="/notifications"
            className="relative text-charcoal hover:text-amber transition-colors"
            aria-label="Notifications"
          >
            <FiBell size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-ember rounded-full" />
          </Link>

          <div className="relative" ref={profileRef}>
            <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-clay/15 flex items-center justify-center text-xs text-clay font-semibold">
                {user?.fullName?.charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-xs text-charcoal font-medium">{user?.fullName}</span>
                <span className="text-[10px] text-muted capitalize">{user?.role}</span>
              </span>
              <FiChevronDown size={14} className="text-muted" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-border rounded-md shadow-lg py-2 z-40">
                <Link to="/profile" className="block px-4 py-2 text-sm text-charcoal hover:bg-panel/50">
                  Profile
                </Link>
                <Link to="/my-projects" className="block px-4 py-2 text-sm text-charcoal hover:bg-panel/50">
                  My Projects
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-charcoal hover:bg-panel/50">
                  Settings
                </Link>
                <div className="border-t border-border my-2" />
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-ember hover:bg-panel/50">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;