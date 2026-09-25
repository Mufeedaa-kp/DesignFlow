
import { SearchProvider } from "../shared/context/SearchProvider";
import DashboardLayout from "./DashboardLayout";
import { adminNavLinks } from "../shared/constants/navLinks";

const AdminLayout = () => {
  return (
    <SearchProvider>
      <DashboardLayout links={adminNavLinks} title="Admin Dashboard" />
    </SearchProvider>
  )
}

export default AdminLayout;