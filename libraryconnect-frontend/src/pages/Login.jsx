import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';
import bgImage from '../assets/login-bg.jpg'; // 📌 add your background image to assets

const Login = () => {
  const [theme, setTheme] = useState('light');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // 🔑 BACKEND WORK STARTS HERE
    // Replace this with real backend login call
    const user = { email, role };
    localStorage.setItem('userInfo', JSON.stringify(user));

    const adminRoles = [
      'Admin/HR',
      'Chief Librarian',
      'Deputy Chief Librarian',
      'Principal Librarian',
    ];

    if (adminRoles.includes(role)) {
      navigate('/admin-dashboard');
    } else {
      navigate('/user-dashboard');
    }
    // 🔑 BACKEND WORK ENDS HERE
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - Image with overlay */}
      <div
        className="hidden md:flex w-2/3 bg-cover bg-center relative rounded-tr-3xl"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-900 bg-opacity-50 flex flex-col justify-end p-10 text-white">
          <h1 className="text-2xl font-bold mb-2">LibraryConnect</h1>
          <p className="max-w-md text-sm">
            Bridging the gap between Sierra Leone Library Board HQ and branches
            by making communication secure, visible, and actionable.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white dark:bg-gray-900 px-6 py-10">
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
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Welcome */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Welcome to LibraryConnect
        </h2>

        {/* Form */}
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
                type={showPassword ? 'text' : 'password'}
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

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Role</option>
              {/* Admin */}
              <option value="Admin/HR">Admin/HR</option>
              <option value="Chief Librarian">Chief Librarian</option>
              <option value="Deputy Chief Librarian">Deputy Chief Librarian</option>
              <option value="Principal Librarian">Principal Librarian</option>
              {/* Users */}
              <option value="Regional Librarian">Regional Librarian</option>
              <option value="District Librarian">District Librarian</option>
              <option value="Librarian in charge">Librarian in Charge</option>
              <option value="Procurement Officer">Procurement Officer</option>
              <option value="Finance Team">Finance Team</option>
              <option value="Auditor">Auditor</option>
              <option value="Secretary">Secretary</option>
              <option value="Departmental Head">Departmental Head</option>
            </select>
          </div>

          {/* Remember me / Forgot password */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <label className="flex items-center gap-2 font-semibold">
              <input type="checkbox" className="accent-blue-600" />
              Remember Me
            </label>
            <a href="#" className="hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Log In
          </button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
            Need an account? Contact your HQ Administrator.
          </p>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-8">
          LibraryConnect – Sierra Leone Library Board @2025
        </p>
      </div>
    </div>
  );
};

export default Login;
