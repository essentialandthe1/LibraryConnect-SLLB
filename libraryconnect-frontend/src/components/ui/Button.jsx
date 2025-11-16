import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  className = "",
  ...props
}) => {
  const base =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md",
    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white",
    ghost:
      "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
  };

  return (
    <button
      type={type}
      disabled={loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
