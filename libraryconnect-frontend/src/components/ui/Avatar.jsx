import React, { forwardRef } from "react";

export const Avatar = forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
    {...props}
  />
));

export const AvatarImage = forwardRef(({ src, alt, className = "", ...props }, ref) => (
  <img
    ref={ref}
    src={src}
    alt={alt}
    className={`w-full h-full rounded-full object-cover ${className}`}
    {...props}
  />
));

export const AvatarFallback = forwardRef(({ children, className = "", ...props }, ref) => (
  <span
    ref={ref}
    className={`text-sm font-medium text-gray-600 dark:text-gray-200 ${className}`}
    {...props}
  >
    {children}
  </span>
));
