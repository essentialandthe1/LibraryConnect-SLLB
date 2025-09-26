// src/layouts/RoleBasedLayout.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import UserLayout from "./UserLayout";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";

const RoleBasedLayout = () => {
  // 👤 Get current user (local/sessionStorage)
  const user =
    JSON.parse(localStorage.getItem("userInfo")) ||
    JSON.parse(sessionStorage.getItem("userInfo"));

  const location = useLocation();

  // 🚪 Redirect to login if no user
  if (!user) return <Navigate to="/" replace />;

  // ✅ Admin roles
  const adminRoles = [
    "Admin/HR",
    "Chief Librarian",
    "Deputy Chief Librarian",
    "Principal Librarian",
  ];

  const isAdmin = adminRoles.includes(user.role);

  // 🎯 Pick layout + dashboard
  const Layout = isAdmin ? AdminLayout : UserLayout;
  const Dashboard = isAdmin ? <AdminDashboard /> : <UserDashboard />;

  return (
    <Layout>
      {/* If path is /dashboard → load correct dashboard */}
      {location.pathname === "/dashboard" ? Dashboard : <Outlet />}
    </Layout>
  );
};

export default RoleBasedLayout;
