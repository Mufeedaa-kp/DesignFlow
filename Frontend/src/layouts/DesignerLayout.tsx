import { SearchProvider } from "../shared/context/SearchProvider";
import DashboardLayout from "./DashboardLayout";
import { designerNavLinks } from "../shared/constants/navLinks";

const DesignerLayout = () => (
  <SearchProvider>
    <DashboardLayout
      links={designerNavLinks}
      title="Designer Dashboard"
    />
  </SearchProvider>
);

export default DesignerLayout;