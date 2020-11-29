import React from "react";
import "./Button.css";
const Button = ({ handleClick }) => {
  return (
    <button type="button" className="button" onClick={handleClick}>
      ADD NEW
    </button>
  );
};

export default Button;
