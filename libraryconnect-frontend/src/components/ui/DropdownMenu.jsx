import React, { forwardRef } from "react";

export const DropdownMenu = forwardRef(({ children, className = "", ...props }, ref) => (
  <div ref={ref} className={`relative inline-block text-left ${className}`} {...props}>
    {children}
  </div>
));

export const DropdownMenuTrigger = forwardRef(({ children, className = "", ...props }, ref) => (
  <button ref={ref} className={`focus:outline-none ${className}`} {...props}>
    {children}
  </button>
));

export const DropdownMenuContent = forwardRef(({ children, className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50 ${className}`}
    {...props}
  >
    {children}
  </div>
));

export const DropdownMenuLabel = ({ children, className = "" }) => (
  <div className={`px-4 py-2 text-sm font-semibold ${className}`}>{children}</div>
);

export const DropdownMenuSeparator = () => (
  <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
);

export const DropdownMenuItem = ({ children, onClick, className = "", ...props }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${className}`}
    {...props}
  >
    {children}
  </button>
);
