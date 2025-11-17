import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './i18n';
import "./index.css";
import "./styles/output.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/api";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";

import { LanguageProvider } from "@/context/LanguageContext"; // create this

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <App />
            <Toaster position="top-right" />
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
