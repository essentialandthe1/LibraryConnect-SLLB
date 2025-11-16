import React from "react";

const Input = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg 
      focus:outline-none focus:ring-2 focus:ring-blue-500 
      dark:bg-gray-800 dark:border-gray-700 dark:text-white 
      dark:focus:ring-blue-400 transition-all duration-200 ${className}`}
    {...props}
  />
));

Input.displayName = "Input";

export default Input;
