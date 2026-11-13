import { useEffect, useState } from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  UserRound,
  Bell,
} from "lucide-react";
import { useUnreadNotificationCount } from "../notifications/hooks/useNotifications";

const NAV_LINKS = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "About Us",
    to: "/about",
  },
  {
    label: "Products",
    to: "/products",
  },
  {
    label: "Contact",
    to: "/contact",
  },
];

const PublicNavBar = () => {
  const { user, logout } = useAuth();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardPath = () => {
    if(user?.role === "admin"){
      return "/admin/dashboard"
    }
    if (user?.role === "designer"){
      return "/designer/dashboard"
    }

    return "/"
  }

  const navLinks = user
    ? user.role === "client"
      ? [
          ...NAV_LINKS,
          { label: "My Requests", to: "/client/requests" },
          { label: "My Projects", to: "/client/projects" },
        ]
      : [
          ...NAV_LINKS,
          {
            label: "Dashboard",
            to: getDashboardPath(),
          },
        ]
    : NAV_LINKS;

  const isTransparent = !scrolled;

  return (
    <>
      {isTransparent && <div className="nav-scrim" />}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent border-transparent"
            : "border-b border-border bg-cream shadow-[0_1px_0_rgba(229,222,207,0.8)]"
        }`}
        style={{ height: "var(--navbar-height)" }}
      >
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-8 px-6 lg:px-10">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 whitespace-nowrap font-serif text-2xl font-semibold tracking-tight"
            style={isTransparent ? { textShadow: "0 1px 8px rgba(0,0,0,0.35)" } : undefined}
          >
            <span className={isTransparent ? "text-cream" : "text-charcoal"}>Design</span>
            <span className={isTransparent ? "text-[#b98a56]" : "text-clay"}>Flow</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-6 xl:gap-8 whitespace-nowrap min-w-0 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `text-[0.8125rem] uppercase tracking-[0.06em] transition-colors ${
                    isTransparent
                      ? isActive
                        ? "text-cream border-b border-cream pb-0.5"
                        : "text-cream/95 hover:text-cream"
                      : isActive
                        ? "text-clay"
                        : "text-muted hover:text-charcoal"
                  }`
                }
                style={isTransparent ? { textShadow: "0 1px 8px rgba(0,0,0,0.35)" } : undefined}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden items-center gap-4 flex-shrink-0 lg:flex">
            {user ? (
              <>
                {/* User name */}
                <span className={`hidden xl:inline font-serif text-lg ${isTransparent ? "text-cream" : "text-charcoal"}`} style={isTransparent ? { textShadow: "0 1px 8px rgba(0,0,0,0.35)" } : undefined}>
                  Hi, {user.fullName}
                </span>

                {user.role === "client" && (
                  <div className="flex items-center gap-2">
                    <NavLink
                      to="/client/notifications"
                      aria-label="Notifications"
                      className={({ isActive }) =>
                        `relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
                          isTransparent
                            ? isActive
                              ? "border-cream bg-cream text-charcoal"
                              : "border-cream/70 bg-transparent text-cream hover:border-cream hover:bg-cream hover:text-charcoal"
                            : isActive
                              ? "border-clay bg-clay text-cream"
                              : "border-clay/40 bg-panel/60 text-clay hover:border-clay hover:bg-clay hover:text-cream"
                        }`
                      }
                      style={isTransparent ? { boxShadow: "0 1px 8px rgba(0,0,0,0.25)" } : undefined}
                    >
                      <Bell size={17} strokeWidth={1.7} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-amber px-1 text-[0.625rem] text-charcoal">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </NavLink>

                    <Link
                      to="/client/profile"
                      aria-label="Profile"
                      title="Profile"
                      className={`group flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
                        isTransparent
                          ? "border-cream/70 bg-transparent text-cream hover:border-cream hover:bg-cream hover:text-charcoal"
                          : "border-clay/40 bg-panel/60 text-clay hover:border-clay hover:bg-clay hover:text-cream"
                      }`}
                      style={isTransparent ? { boxShadow: "0 1px 8px rgba(0,0,0,0.25)" } : undefined}
                    >
                      <UserRound
                        size={17}
                        strokeWidth={1.7}
                        className="transition-transform duration-200 group-hover:scale-105"
                      />
                    </Link>
                  </div>
                )}

                {/* Logout */}
                <button
                  type="button"
                  onClick={logout}
                  className={`border px-5 py-2.5 text-sm uppercase tracking-wide transition-colors ${
                    isTransparent
                      ? "border-cream text-cream hover:bg-[var(--color-brown)] hover:border-[var(--color-brown)] hover:text-cream"
                      : "border-clay text-clay hover:bg-clay hover:text-cream"
                  }`}
                  style={isTransparent ? { textShadow: "0 1px 8px rgba(0,0,0,0.35)" } : undefined}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  to="/client/login"
                  className={`text-sm uppercase tracking-wide transition-colors ${
                    isTransparent ? "text-cream/95 hover:text-cream" : "text-muted hover:text-charcoal"
                  }`}
                  style={isTransparent ? { textShadow: "0 1px 8px rgba(0,0,0,0.35)" } : undefined}
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className={`border px-5 py-2.5 text-sm uppercase tracking-wide transition-colors ${
                    isTransparent
                      ? "border-cream text-cream hover:bg-[var(--color-brown)] hover:border-[var(--color-brown)] hover:text-cream"
                      : "border-clay text-clay hover:bg-clay hover:text-cream"
                  }`}
                  style={isTransparent ? { textShadow: "0 1px 8px rgba(0,0,0,0.35)" } : undefined}
                >
                  Register
                </Link>
              </>
            )}
          </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className={`${isTransparent ? "text-cream" : "text-charcoal"} lg:hidden`}
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
          style={isTransparent ? { textShadow: "0 1px 8px rgba(0,0,0,0.35)" } : undefined}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="space-y-1 border-t border-border bg-cream px-6 py-4 lg:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block py-2.5 text-sm uppercase tracking-wide ${
                  isActive ? "text-clay" : "text-muted"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {user && user.role === "client" && (
            <NavLink
              to="/client/notifications"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 py-2.5 text-sm uppercase tracking-wide ${
                  isActive ? "text-clay" : "text-muted"
                }`
              }
            >
              <Bell size={16} />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber px-1.5 text-xs text-charcoal">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </NavLink>
          )}

          <div className="mt-3 border-t border-border pt-3">
            {user ? (
              <>
                <p className="mb-3 font-serif text-lg text-charcoal">
                  Hi, {user.fullName}
                </p>

                {/* Client profile */}
                {user.role === "client" && (
                  <Link
                    to="/client/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm uppercase tracking-wide text-muted"
                  >
                    Profile
                  </Link>
                )}

                {/* Logout */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="mt-2 border border-clay px-5 py-2.5 text-sm uppercase tracking-wide text-clay"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                {/* Login */}
                <Link
                  to="/client/login"
                  onClick={() => setMobileOpen(false)}
                  className="block border border-clay px-5 py-2.5 text-center text-sm uppercase tracking-wide text-clay"
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block border border-clay px-5 py-2.5 text-center text-sm uppercase tracking-wide text-clay"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      </header>
    </>
  );
};

export default PublicNavBar;