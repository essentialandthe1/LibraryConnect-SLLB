// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

// 📸 Multiple background images (rotating slideshow)
import bg1 from "../assets/login-bg1.jpg";
import bg2 from "../assets/login-bg2.jpg";

// 🔧 Toggle backend mode
const USE_BACKEND = false; // false = local mock users, true = real backend
const API_URL = "http://127.0.0.1:8000/api/auth/login/"; // backend login endpoint

// 🧑‍🤝‍🧑 Mock users (for local login without backend)
const mockUsers = [
  { email: "admin@sllb.sl", password: "admin123", role: "Admin/HR" },
  { email: "chief@sllb.sl", password: "chief123", role: "Chief Librarian" },
  { email: "user@sllb.sl", password: "user123", role: "User" },
];

const Login = () => {
  const navigate = useNavigate();

  // 🌗 Theme & UI states
  const [theme, setTheme] = useState("light");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🧠 Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false); 

  // 🖼️ Background slideshow
  const images = [bg1, bg2];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]); // ✅ added images.length

  // 🌞🌙 Toggle light/dark mode
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // 🔑 Handle login (mock or backend)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userData;

      if (USE_BACKEND) {
        // 📡 Backend login (future-ready)
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          toast.error("❌ Invalid email or password");
          setLoading(false);
          return;
        }

        userData = await res.json(); // Expected { email, role, token }
      } else {
        // 🧑‍💻 Local mock login
        const foundUser = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (!foundUser) {
          toast.error("❌ Invalid email or password");
          setLoading(false);
          return;
        }

        userData = foundUser;
      }

      // ✅ Store session
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("userInfo", JSON.stringify(userData));

      toast.success(`✅ Welcome, ${userData.email}`);

      // 🎯 Redirect by role
      const adminRoles = [
        "Admin/HR",
        "Chief Librarian",
        "Deputy Chief Librarian",
        "Principal Librarian",
      ];
      navigate(adminRoles.includes(userData.role) ? "/admin-dashboard" : "/user-dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - Background slideshow */}
      <div className="hidden md:flex w-2/3 relative overflow-hidden rounded-tr-3xl">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}

        {/* Overlay text */}
        <div className="absolute inset-0 bg-blue-900 bg-opacity-20 flex flex-col justify-end p-10 text-white rounded-tr-3xl z-10">
          <h1 className="text-2xl font-bold mb-2">LibraryConnect</h1>
          <p className="max-w-md text-sm">
            Bridging the gap between Sierra Leone Library Board HQ and branches
            by making communication secure, visible, and actionable.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white dark:bg-gray-900 px-6 py-10 relative z-20">
        {/* Logo + Theme Toggle */}
        <div className="flex justify-between w-full max-w-sm items-center mb-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SLLB Logo" className="w-8 h-8" />
            <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">
              SLLB
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className="text-gray-700 dark:text-gray-200"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Welcome to LibraryConnect
        </h2>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full mt-1 px-3 py-2 border rounded-md placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full mt-1 px-3 py-2 border rounded-md pr-10 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 dark:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <label className="flex items-center gap-2 font-semibold">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-blue-600"
              />
              Remember Me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
            Need help? Contact your HQ Administrator.
          </p>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-8">
          LibraryConnect – Sierra Leone Library Board © 2025
        </p>
      </div>
    </div>
  );
};

export default Login;
