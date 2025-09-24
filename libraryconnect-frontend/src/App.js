import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RoleBasedLayout from "./layouts/RoleBasedLayout";
import Upload from "./pages/Upload";
import Inbox from "./pages/Inbox";
import Settings from "./pages/Settings";
import DashboardRouter from "./pages/DashboardRouter";
import CreateUser from "./pages/CreateUser";
import ManageUsers from "./pages/ManageUsers";
import EditUser from "./pages/EditUser";
import ViewDocument from "./pages/ViewDocument";
import FolderView from "./pages/FolderView";
import Trash from "./pages/Trash";
import Notifications from "./pages/Notifications";
import FolderDocuments from "./pages/FolderDocuments"; // ✅ NEW IMPORT

// Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

// Protected route
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Protected routes inside layout */}
        <Route path="/*" element={<RoleBasedLayout />}>
          {/* 🔐 Admin dashboard */}
          <Route
            path="admin-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Admin/HR",
                  "Chief Librarian",
                  "Deputy Chief Librarian",
                  "Principal Librarian",
                ]}
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 🔐 User dashboard */}
          <Route
            path="user-dashboard"
            element={
              <ProtectedRoute allowedRoles={["User", "Staff", "Branch Librarian"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Shared routes */}
          <Route path="dashboard" element={<DashboardRouter />} />
          <Route path="upload" element={<Upload />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="settings" element={<Settings />} />

          {/* Admin tools */}
          <Route path="create-user" element={<CreateUser />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="edit-user/:email" element={<EditUser />} />

          {/* Documents + folders */}
          <Route path="view-document/:id" element={<ViewDocument />} />
          <Route path="folders" element={<FolderView />} />
          <Route path="folder-documents" element={<FolderDocuments />} /> {/* ✅ NEW ROUTE */}
          <Route path="trash" element={<Trash />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
