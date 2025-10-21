// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/output.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/api";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// 🧩 App root with global providers
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
