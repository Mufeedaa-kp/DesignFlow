import { SearchProvider } from "../shared/context/SearchProvider";
import { Outlet } from "react-router-dom";
import NavBar from "./navbar/NavBar";

const clientLinks = [
  { label: "Dashboard", to: "/client/dashboard" },
  { label: "My Requests", to: "/client/requests" },
  { label: "My Projects", to: "/client/projects" },
 
];

const ClientLayout = () => {
  return (
    <SearchProvider>
    <div className="min-h-screen bg-panel/30">
      <NavBar title="Client Dashboard" links={clientLinks} />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
    </SearchProvider>
  );
};

export default ClientLayout;