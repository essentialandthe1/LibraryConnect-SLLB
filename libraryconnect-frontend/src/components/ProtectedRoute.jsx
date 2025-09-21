// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userInfo =
    JSON.parse(localStorage.getItem("userInfo")) ||
    JSON.parse(sessionStorage.getItem("userInfo"));

  if (!userInfo) {
    // 🚫 Not logged in → back to login
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    // 🚫 Logged in but no permission
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in + correct role
  return children;
};

export default ProtectedRoute;
