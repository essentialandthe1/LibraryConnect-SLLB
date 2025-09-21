import * as React from "react";

export function DropdownMenu({ children }) {
  return <div className="relative inline-block text-left">{children}</div>;
}

export function DropdownMenuTrigger({ children }) {
  return <button className="focus:outline-none">{children}</button>;
}

export function DropdownMenuContent({ children }) {
  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50">
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children }) {
  return <div className="px-4 py-2 text-sm font-semibold">{children}</div>;
}

export function DropdownMenuSeparator() {
  return <div className="border-t border-gray-200 dark:border-gray-600 my-1" />;
}

export function DropdownMenuItem({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
    >
      {children}
    </button>
  );
}
