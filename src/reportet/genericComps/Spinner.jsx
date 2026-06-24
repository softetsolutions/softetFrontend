import React from "react";

const Spinner = ({ size = 20, borderWidth = 2, className = "" }) => {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-blue-500 border-t-transparent ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${borderWidth}px`,
        borderStyle: "solid",
      }}
    />
  );
};

export default Spinner;
