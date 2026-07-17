import type { ReactNode } from "react";
import LogoutButton from "../common/LogoutButton";
import { useAuth } from "../../hooks/useAuth";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid #ddd" }}>
        <span>Welcome, {user?.fullName} ({user?.role})</span>
        <LogoutButton />
      </header>
      <main style={{ padding: "20px" }}>{children}</main>
    </div>
  );
};

export default DashboardLayout;