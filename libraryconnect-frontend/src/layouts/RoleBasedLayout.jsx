import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import UserLayout from "./UserLayout";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import { useTheme } from "@/contexts/ThemeContext";
import AppLayout from "./AppLayout"; // ✅ Global theme wrapper

const RoleBasedLayout = () => {
  // 👤 Get current user (local/sessionStorage)
  const user =
    JSON.parse(localStorage.getItem("userInfo")) ||
    JSON.parse(sessionStorage.getItem("userInfo"));

  const location = useLocation();
  const { theme } = useTheme(); // 🌙 global theme

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
    <AppLayout>
      <div className="flex flex-col min-h-screen">
        <Layout>
          {/* Load dashboard on /dashboard path, otherwise render child routes */}
          {location.pathname === "/dashboard" ? Dashboard : <Outlet />}
        </Layout>
      </div>
    </AppLayout>
  );
};

export default RoleBasedLayout;
