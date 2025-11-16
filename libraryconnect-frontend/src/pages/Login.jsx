import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

// Reusable UI components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Background images
import bg1 from "../assets/login-bg1.jpg";
import bg2 from "../assets/login-bg2.jpg";

// Auth & Theme Context
import { useAuthContext } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

// Toggle backend mode
const USE_BACKEND = false;
const API_URL = "http://127.0.0.1:8000/api/auth/login/";

// Mock users
const mockUsers = [
  { email: "admin@sllb.sl", password: "admin123", role: "Admin/HR" },
  { email: "chief@sllb.sl", password: "chief123", role: "Chief Librarian" },
  { email: "user@sllb.sl", password: "user123", role: "User" },
];

// Background slideshow component
const BackgroundSlideshow = ({ images }) => {
  const [current, setCurrent] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => setCurrent((prev) => (prev + 1) % images.length), 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="hidden md:flex w-2/3 relative overflow-hidden rounded-tr-3xl">
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            idx === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
      <div className="absolute inset-0 bg-blue-900 bg-opacity-20 flex flex-col justify-end p-10 text-white rounded-tr-3xl z-10">
        <h1 className="text-2xl font-bold mb-2">LibraryConnect</h1>
        <p className="max-w-md text-sm">
          Bridging the gap between Sierra Leone Library Board HQ and branches
          by making communication secure, visible, and actionable.
        </p>
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const { theme, toggleTheme } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userData;

      if (USE_BACKEND) {
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

        userData = await res.json();
      } else {
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

      // Save user info
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("userInfo", JSON.stringify(userData));
      setUser(userData);

      toast.success(`✅ Welcome, ${userData.email}`);

      // Navigate to appropriate dashboard
      const adminRoles = ["Admin/HR", "Chief Librarian", "Deputy Chief Librarian", "Principal Librarian"];
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
      <BackgroundSlideshow images={[bg1, bg2]} />

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white dark:bg-gray-900 px-6 py-10 relative z-20">
        {/* Logo + Theme Toggle */}
        <div className="flex justify-between w-full max-w-sm items-center mb-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SLLB Logo" className="w-8 h-8" />
            <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">SLLB</h1>
          </div>
          <button onClick={toggleTheme} className="text-gray-700 dark:text-gray-200">
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Welcome to LibraryConnect
        </h2>

        {/* Login Form */}
        <Card className="w-full max-w-sm space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="pr-10"
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

            <Button type="submit" loading={loading} className="w-full mt-2">
              Log In
            </Button>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
              Need help? Contact your HQ Administrator.
            </p>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-8">
          LibraryConnect – Sierra Leone Library Board © 2025
        </p>
      </div>
    </div>
  );
};

export default Login;
