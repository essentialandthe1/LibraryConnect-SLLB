import * as React from "react";

export function Avatar({ className, ...props }) {
  return (
    <div
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 ${className}`}
      {...props}
    />
  );
}

export function AvatarImage({ src, alt }) {
  return <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />;
}

export function AvatarFallback({ children }) {
  return (
    <span className="text-sm font-medium text-gray-600 dark:text-gray-200">
      {children}
    </span>
  );
}
