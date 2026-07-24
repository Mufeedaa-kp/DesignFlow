import type { ReactNode } from "react";
import NavBar from "./NavBar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-cream">
      <NavBar />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;

