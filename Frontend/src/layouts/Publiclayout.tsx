import { Outlet } from "react-router-dom";
import PublicNavBar from "../features/public/PublicNavBar";
import PublicFooter from "../features/public/PublicFooter";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <PublicNavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;