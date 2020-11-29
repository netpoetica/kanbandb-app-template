import React from "react";
import "./Button.css";
const Button = ({ handleClick }) => {
  return (
    <button type="button" className="button" onClick={handleClick}>
      {/* <p>ADD NEW</p>{" "} */}
      ADD NEW
    </button>
  );
};

export default Button;
