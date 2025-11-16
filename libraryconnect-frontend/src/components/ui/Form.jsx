import React from "react";

export const Form = ({ children, className = "", ...props }) => {
  return (
    <form className={`space-y-4 ${className}`} {...props}>
      {children}
    </form>
  );
};
