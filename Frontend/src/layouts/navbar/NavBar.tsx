import { useState } from "react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";
import NotificationButton from "./NotificationButton";
import ProfileMenu from "./ProfileMenu";
import { useUnreadNotificationCount } from "../../features/notifications/hooks/useNotifications";


interface NavBarLink {
  label: string;
  to: string;
}

interface NavBarProps {
  title: string;
  links?: NavBarLink[];
  onMenuClick?: () => void;
}

const SEARCHABLE_PATH_SEGMENTS = [
  "/projects",
  "/users",
  "/requests",
];

const NavBar = ({
  title,
  links = [],
  onMenuClick,
}: NavBarProps) => {
  const { data: unreadCount = 0 } =
  useUnreadNotificationCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isQuotationPage =
    location.pathname.includes("/quotation");

  const showSearch =
    !isQuotationPage &&
    SEARCHABLE_PATH_SEGMENTS.some((segment) =>
      location.pathname.includes(segment)
    );

  const handleHamburgerClick = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      setMobileMenuOpen((o) => !o);
    }
  };

  const showHamburger =
    !!onMenuClick || links.length > 0;

  return (
    <header className="bg-cream border-b border-border shrink-0 relative">
      <div className="h-16 flex items-center justify-between px-4 sm:px-6">

        <div className="flex items-center gap-3">
          {showHamburger && (
            <button
              onClick={handleHamburgerClick}
              className="md:hidden text-charcoal p-1 -ml-1"
              aria-label="Toggle menu"
            >
              {!onMenuClick && mobileMenuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          )}

          <p className="font-serif font-bold text-lg sm:text-xl text-charcoal">
            {title}
          </p>
        </div>

        {links.length > 0 && (
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <RouterNavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-clay"
                      : "text-muted hover:text-charcoal"
                  }`
                }
              >
                {link.label}
              </RouterNavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-4">
          {showSearch && (
            <div className="hidden sm:block">
              <SearchBar />
            </div>
          )}

          <NotificationButton
            unreadCount={unreadCount}
          />

          <ProfileMenu />
        </div>
      </div>

      {/* Internal mobile dropdown */}
      {!onMenuClick &&
        links.length > 0 &&
        mobileMenuOpen && (
          <nav className="md:hidden border-t border-border bg-cream px-4 py-3 space-y-1">
            {links.map((link) => (
              <RouterNavLink
                key={link.to}
                to={link.to}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className={({ isActive }) =>
                  `block px-2 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-clay bg-panel"
                      : "text-muted hover:text-charcoal hover:bg-panel/50"
                  }`
                }
              >
                {link.label}
              </RouterNavLink>
            ))}

            {showSearch && (
              <div className="sm:hidden pt-2">
                <SearchBar />
              </div>
            )}
          </nav>
        )}
    </header>
  );
};

export default NavBar;