import React from "react";

const Carousel = ({ children, className = "" }) => {
  return (
    <div className={`w-full overflow-x-auto whitespace-nowrap ${className}`}>
      {children}
    </div>
  );
};

export default Carousel;
