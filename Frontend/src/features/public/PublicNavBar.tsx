import { useState } from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  UserRound,
} from "lucide-react";

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

  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardPath = () => {
    if(user?.role === "admin"){
      return "/admin/dashboard"
    }
    if (user?.role === "designer"){
      return "/designer/dashboard"
    }

    return "/client/dashboard"
  }

  const navLinks = user
    ? [
        ...NAV_LINKS,
        {
          label: "Dashboard",
          to: getDashboardPath(),
        },
      ]
    : NAV_LINKS;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:px-10">
        {/* Logo */}
        <Link
          to="/"
          className="ml-2 font-serif text-2xl font-semibold tracking-tight text-charcoal sm:ml-4"
        >
          Design
          <span className="text-clay">Flow</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm uppercase tracking-wide transition-colors ${
                  isActive
                    ? "text-clay"
                    : "text-muted hover:text-charcoal"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-6 md:flex">
          {user ? (
            <>
              {/* User name */}
              <span className="font-serif text-lg text-charcoal">
                Hi, {user.fullName}
              </span>

              {/* Client profile */}
              {user.role === "client" && (
                <Link
                  to="/client/profile"
                  aria-label="Profile"
                  title="Profile"
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-clay/40 bg-panel/60 text-clay transition-all duration-200 hover:border-clay hover:bg-clay hover:text-cream"
                >
                  <UserRound
                    size={17}
                    strokeWidth={1.7}
                    className="transition-transform duration-200 group-hover:scale-105"
                  />
                </Link>
              )}

              {/* Logout */}
              <button
                type="button"
                onClick={logout}
                className="border border-clay px-5 py-2.5 text-sm uppercase tracking-wide text-clay transition-colors hover:bg-clay hover:text-cream"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/client/login"
                className="text-sm uppercase tracking-wide text-muted transition-colors hover:text-charcoal"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="border border-clay px-5 py-2.5 text-sm uppercase tracking-wide text-clay transition-colors hover:bg-clay hover:text-cream"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="text-charcoal md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="space-y-1 border-t border-border bg-cream px-6 py-4 md:hidden">
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
              <>
                {/* Login */}
                <Link
                  to="/client/login"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm uppercase tracking-wide text-muted"
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 block border border-clay px-5 py-2.5 text-center text-sm uppercase tracking-wide text-clay"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavBar;