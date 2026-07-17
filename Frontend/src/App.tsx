import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import DashboardLayout from "./components/layout/DashboardLayout";

// Temporary placeholder dashboards for testing
const AdminDashboard = () => ( <DashboardLayout>
    <h1>Admin Dashboard</h1>
  </DashboardLayout> ) 
const DesignerDashboard = () => ( <DashboardLayout>
    <h1>Designer Dashboard</h1>
  </DashboardLayout>
);
const ClientDashboard = () => (
  <DashboardLayout>
    <h1>Client Dashboard</h1>
  </DashboardLayout>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/designer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["designer"]}>
                <DesignerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;