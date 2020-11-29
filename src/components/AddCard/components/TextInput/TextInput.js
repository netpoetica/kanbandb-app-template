import React from "react";
import "./TextInput.css";

const TextInput = ({ handleChangeInput, inputValue }) => {
  return (
    <input
      type="type"
      name="cardData"
      value={inputValue}
      placeholder={"e.g. Test: give me an interview"}
      onChange={handleChangeInput}
      className="textInput"
    ></input>
  );
};

export default TextInput;
