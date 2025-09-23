// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // 👤 Get user from local/session storage
  // 🔧 Later: fetch token/session from backend
  const userInfo =
    JSON.parse(localStorage.getItem("userInfo")) ||
    JSON.parse(sessionStorage.getItem("userInfo"));

  if (!userInfo) {
    // 🚫 Not logged in → back to login
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    // 🚫 Logged in but not allowed
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in + role allowed
  return children;
};

export default ProtectedRoute;
