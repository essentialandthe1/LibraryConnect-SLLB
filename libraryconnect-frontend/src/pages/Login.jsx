import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

// Assets
import logo from "../assets/logo.png";
import bg1 from "../assets/login-bg1.jpg";
import bg2 from "../assets/login-bg2.jpg";

// shadcn-ui components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Auth + Theme Context
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

// Layout
import AppLayout from "@/layouts/AppLayout";

// Mock toggle
const USE_BACKEND = false;
const API_URL = "http://127.0.0.1:8000/api/auth/login/";

const mockUsers = [
  { email: "admin@sllb.sl", password: "admin123", role: "Admin/HR" },
  { email: "chief@sllb.sl", password: "chief123", role: "Chief Librarian" },
  { email: "user@sllb.sl", password: "user123", role: "User" },
];

// -------------------------------
// Background Slideshow Component
// -------------------------------
const BackgroundSlideshow = ({ images }) => {
  const [current, setCurrent] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % images.length),
      5000
    );
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

      <div className="absolute inset-0 bg-black/20 dark:bg-black/50 flex flex-col justify-end p-10 text-white rounded-tr-3xl z-10">
        <h1 className="text-2xl font-bold mb-2">LibraryConnect</h1>
        <p className="max-w-md text-sm opacity-90">
          Bridging the gap between Sierra Leone Library Board HQ and branches by
          making communication secure, visible, and actionable.
        </p>
      </div>
    </div>
  );
};

// -------------------------------
// Theme Toggle Component
// -------------------------------
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
};

// -------------------------------
// Login Page
// -------------------------------
const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { theme } = useTheme();

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

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("userInfo", JSON.stringify(userData));
      setUser(userData);

      toast.success(`✅ Welcome, ${userData.email}`);

      const adminRoles = [
        "Admin/HR",
        "Chief Librarian",
        "Deputy Chief Librarian",
        "Principal Librarian",
      ];

      navigate(
        adminRoles.includes(userData.role)
          ? "/admin-dashboard"
          : "/user-dashboard"
      );
    } catch (err) {
      console.error("Login error:", err);
      toast.error("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen flex">
        <BackgroundSlideshow images={[bg1, bg2]} />

        <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 py-10 relative z-20">
          {/* Header */}
          <div className="flex justify-between w-full max-w-sm items-center mb-6">
            <div className="flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              <h1 className="text-lg font-bold text-primary">SLLB</h1>
            </div>
            <ThemeToggle />
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold mb-6">Welcome to LibraryConnect</h2>

          {/* Login Form */}
          <Card className="w-full max-w-sm p-5 space-y-4">
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <Label>Email</Label>
                <div className="relative rounded">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pr-10"
                />
                </div>
              </div>

              <div>
                <Label>Password</Label>
                <div className="relative rounded">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-primary"
                />
                Remember Me
              </label>

              <Button type="submit" disabled={loading} className="w-full mt-2 rounded">
                {loading ? "Logging in..." : "Log In"}
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-2">
                Need help? Contact your HQ Administrator.
              </p>
            </form>
          </Card>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            LibraryConnect – Sierra Leone Library Board © 2025
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Login;
