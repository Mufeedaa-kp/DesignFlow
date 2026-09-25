
import { Navigate } from "react-router-dom"
import { useAuth } from "../features/auth/hooks/useAuth"
import type { ReactNode } from "react"

interface Props {
  children: ReactNode
  allowedRoles: string[]
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, token } = useAuth()

 
  if (!token || !user) {
    return <Navigate to="/" replace />
  }


  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

