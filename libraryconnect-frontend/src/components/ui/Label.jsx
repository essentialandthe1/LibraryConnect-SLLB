import React from "react";

const Label = ({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
  >
    {children}
  </label>
);

export default Label;
