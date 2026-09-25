import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "../../../features/auth/hooks/useAuth"

const LogoutButton = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully")
    navigate("/")
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  )
}

export default LogoutButton