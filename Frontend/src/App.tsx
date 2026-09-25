
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./routes/ProtectedRoute";

//public

import PublicNavBar from "./features/public/PublicNavBar";
import PublicFooter from "./features/public/PublicFooter";

import Landing from "./features/public/pages/Landing";
import About from "./features/public/pages/About";
import Contact from "./features/public/pages/Contact";
import Products from "./features/public/pages/Products";
import ProductCategoryPage from "./features/public/pages/ProductCategoryPage";

//auth

import AdminLogin from "./features/auth/pages/AdminLogin";
import DesignerLogin from "./features/auth/pages/DesignerLogin";
import ClientLogin from "./features/auth/pages/ClientLogin";
import Register from "./features/auth/pages/Register";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";

//layouts

import AdminLayout from "./layouts/AdminLayout";
import DesignerLayout from "./layouts/DesignerLayout";
import ClientLayout from "./layouts/ClientLayout";

import NotificationsPage from "./features/notifications/pages/NotificationsPage";

//admin

import AdminDashboard from "./features/dashboard/pages/AdminDashboard";

import AdminProjectsList from "./features/projects/pages/admin/AdminProjectsList";
import AdminProjectDetail from "./features/projects/pages/admin/AdminProjectDetail";

import AdminProjectRequestsPage from "./features/projectRequests/pages/admin/AdminProjectRequestsPage";
import AdminProjectRequestDetailsPage from "./features/projectRequests/pages/admin/AdminProjectRequestDetailsPage";

import AdminCatalogPage from "./features/catalog/pages/AdminCatalogPage";
import CategoryCatalogItemsPage from "./features/catalog/pages/CategoryCatalogItemsPage";

import AdminUsersList from "./features/users/pages/admin/AdminUsersList";
import AdminUserDetail from "./features/users/pages/admin/AdminUserDetail";

import AdminAnalytics from "./features/analytics/pages/AdminAnalytics";
import AdminSettings from "./features/settings/pages/AdminSettings";

import AdminQuotationReviewPage from "./features/quotations/pages/admin/AdminQuotationReviewPage";

//designer
import DesignerDashboard from "./features/dashboard/pages/DesignerDashboard";

import PendingAssignments from "./features/projects/pages/designer/PendingAssignments";
import DesignerProjectsList from "./features/projects/pages/designer/DesignerProjectsList";
import DesignerProjectDetail from "./features/projects/pages/designer/DesignerProjectDetail";

import DesignerClientsList from "./features/users/pages/designer/DesignerClientsList";
import DesignerClientDetail from "./features/users/pages/designer/DesignerClientDetail";

import DesignerQuotationsPage from "./features/quotations/pages/designer/DesignerQuotationsPage";
import DesignerQuotationDetailsPage from "./features/quotations/pages/designer/DesignerQuotationDetailsPage";

import DesignerMoodBoardsPage from "./features/moodboards/pages/DesignerMoodBoardsPage";
import DesignerMoodBoardDetailPage from "./features/moodboards/pages/DesignerMoodBoardDetailPage";

//client

import ClientDashboard from "./features/dashboard/pages/clientDashboard";

import MyProjectRequestsPage from "./features/projectRequests/pages/client/MyProjectRequestsPage";
import ProjectRequestDetailsPage from "./features/projectRequests/pages/client/ProjectRequestDetailsPage";
import CreateProjectRequestPage from "./features/projectRequests/pages/client/CreateProjectRequestPage";

import ClientProfile from "./features/profile/pages/ClientProfile";

import ClientProjectDetail from "./features/projects/pages/client/ClientProjectDetail";
import ClientProjectsPage from "./features/projects/pages/client/ClientProjectsPage";

import ClientQuotationPage from "./features/quotations/pages/client/ClientQuotationPage";

import ClientMoodBoardDetailPage from "./features/moodboards/pages/ClientMoodBoardDetailPage";


function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />

      <Routes>

        {/* public */}

        <Route
          path="/"
          element={
            <>
              <PublicNavBar />
              <Landing />
              <PublicFooter />
            </>
          }
        />

        <Route
          path="/about"
          element={
            <>
              <PublicNavBar />
              <About />
              <PublicFooter />
            </>
          }
        />

        <Route
          path="/products"
          element={
            <>
              <PublicNavBar />
              <Products />
              <PublicFooter />
            </>
          }
        />


        <Route
          path="/products/:slug"
          element={
            <>
              <PublicNavBar />
              <ProductCategoryPage />
              <PublicFooter />
            </>
          }
        />

        <Route
          path="/contact"
          element={
            <>
              <PublicNavBar />
              <Contact />
              <PublicFooter />
            </>
          }
        />

        {/* auth */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/designer/login"
          element={<DesignerLogin />}
        />

        <Route
          path="/client/login"
          element={<ClientLogin />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        <Route
  path="/notifications"
  element={<NotificationsPage />}
/>

        {/* admin */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="projects"
            element={<AdminProjectsList />}
          />

          <Route
            path="projects/:id"
            element={<AdminProjectDetail />}
          />

          <Route
            path="projects/:projectId/quotation"
            element={<AdminQuotationReviewPage />}
          />

          <Route
            path="requests"
            element={<AdminProjectRequestsPage />}
          />

          <Route
            path="requests/:id"
            element={<AdminProjectRequestDetailsPage />}
          />

          <Route
            path="users"
            element={<AdminUsersList />}
          />

          <Route
            path="users/:id"
            element={<AdminUserDetail />}
          />

          <Route
            path="analytics"
            element={<AdminAnalytics />}
          />

          <Route
            path="settings"
            element={<AdminSettings />}
          />

          <Route
            path="catalog"
            element={<AdminCatalogPage />}
          />

          <Route
            path="catalog/:categoryId"
            element={<CategoryCatalogItemsPage />}
          />
        </Route>

        {/* designer */}

        <Route
          path="/designer"
          element={
            <ProtectedRoute
              allowedRoles={["designer"]}
            >
              <DesignerLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<DesignerDashboard />}
          />

          <Route
            path="pending-assignments"
            element={<PendingAssignments />}
          />

          <Route
            path="projects"
            element={<DesignerProjectsList />}
          />

          <Route
            path="projects/:id"
            element={<DesignerProjectDetail />}
          />

          <Route
            path="moodboards"
            element={<DesignerMoodBoardsPage />}
          />

          <Route
            path="moodboards/:projectId"
            element={<DesignerMoodBoardDetailPage />}
          />

          <Route
            path="quotations"
            element={<DesignerQuotationDetailsPage />}
          />

          <Route
            path="projects/:projectId/quotation"
            element={<DesignerQuotationsPage />}
          />

          <Route
            path="clients"
            element={<DesignerClientsList />}
          />

          <Route
            path="clients/:id"
            element={<DesignerClientDetail />}
          />
        </Route>

        {/* client */}

        <Route
          path="/client"
          element={
            <ProtectedRoute
              allowedRoles={["client"]}
            >
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<ClientDashboard />}
          />

          {/* Project Requests */}

          <Route
            path="requests"
            element={<MyProjectRequestsPage />}
          />

          <Route
            path="requests/:id"
            element={<ProjectRequestDetailsPage />}
          />

          <Route
            path="requests/new"
            element={<CreateProjectRequestPage />}
          />


          <Route
            path="moodboards/:projectId"
            element={<ClientMoodBoardDetailPage />}
          />

          <Route
            path="projects"
            element={<ClientProjectsPage />}
          />

          <Route
            path="projects/:id"
            element={<ClientProjectDetail />}
          />

          <Route
            path="profile"
            element={<ClientProfile />}
          />
        </Route>

        <Route
          path="/client/projects/:projectId/quotation"
          element={
            <ProtectedRoute
              allowedRoles={["client"]}
            >
              <ClientQuotationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

