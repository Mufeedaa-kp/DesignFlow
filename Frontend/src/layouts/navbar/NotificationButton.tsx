import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

interface NotificationButtonProps {
  unreadCount?: number;
}

const NotificationButton = ({
  unreadCount = 0,
}: NotificationButtonProps) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/notifications")}
      className="relative text-muted hover:text-charcoal transition-colors"
      aria-label="Notifications"
    >
      <Bell size={20} />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-ember rounded-full" />
      )}
    </button>
  );
};

export default NotificationButton;