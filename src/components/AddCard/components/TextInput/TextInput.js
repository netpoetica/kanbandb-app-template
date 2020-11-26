import React from "react";
import "./TextInput.css";

const TextInput = ({ handleChange, inputValue }) => {
  return (
    <input
      type="type"
      name="cardData"
      value={inputValue}
      placeholder={"e.g. Test: give me an interview"}
      onChange={handleChange}
      className="textInput"
    ></input>
  );
};

export default TextInput;
