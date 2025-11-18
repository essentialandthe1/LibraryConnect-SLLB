// src/layouts/AppLayout.jsx
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

const AppLayout = ({ children }) => {
  const { theme } = useTheme(); // gets the global theme

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground transition-colors ${theme}`}>
      {children}
    </div>
  );
};

export default AppLayout;
