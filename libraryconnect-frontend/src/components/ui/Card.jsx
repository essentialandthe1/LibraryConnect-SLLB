import React, { forwardRef } from "react";

const Card = forwardRef(({ children, className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md ${className}`}
    {...props}
  >
    {children}
  </div>
));

export default Card;
