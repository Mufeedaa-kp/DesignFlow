import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-clay text-sm font-semibold text-cream transition-opacity hover:opacity-90"
        aria-label="Open profile menu"
        title={user?.fullName}
      >
        {user?.fullName?.charAt(0).toUpperCase() ?? "?"}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-border bg-cream py-1 shadow-lg">
          <div className="border-b border-border px-4 py-2">
            <p className="truncate text-sm font-medium text-charcoal">
              {user?.fullName}
            </p>

            <p className="text-xs capitalize text-muted">
              {user?.role}
            </p>
          </div>

          {user?.role === "client" && (
            <button
              onClick={() => {
                setOpen(false);
                navigate("/client/profile");
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-charcoal transition-colors hover:bg-panel/50"
            >
              <User size={15} />
              Profile
            </button>
          )}

          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-ember transition-colors hover:bg-panel/50"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;