// src/layouts/RoleBasedLayout.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import UserLayout from "./UserLayout";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";

const RoleBasedLayout = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const location = useLocation();

  if (!user) return <Navigate to="/" />;

  // ✅ Use same admin roles definition as Login.jsx
  const adminRoles = [
    "Admin/HR",
    "Chief Librarian",
    "Deputy Chief Librarian",
    "Principal Librarian",
  ];

  const isAdmin = adminRoles.includes(user.role);

  const Layout = isAdmin ? AdminLayout : UserLayout;
  const Dashboard = isAdmin ? <AdminDashboard /> : <UserDashboard />;

  return (
    <Layout>
      {/* If route is /dashboard, show the right dashboard */}
      {location.pathname === "/dashboard" ? Dashboard : <Outlet />}
    </Layout>
  );
};

export default RoleBasedLayout;
