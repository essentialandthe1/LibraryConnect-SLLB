import React from "react";

const Card = ({ className = "", children }) => {
  return (
    <div className={`p-4 bg-white rounded-lg shadow ${className}`}>
      {children}
    </div>
  );
};

export default Card;
