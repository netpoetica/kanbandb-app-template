import React from "react";
import "./AddCard.css";
import Button from "./components/Button/Button";
import TextInput from "./components/TextInput/TextInput";
import "./AddCard.css";
import { useState } from "react";

const AddCard = ({ addCard, handleChange, handleClick, inputValue }) => {
  return (
    // <div className={`addCard ${addCard}`}>
    <div className={`addCard`}>
      <div className="addCard__container">
        <TextInput inputValue={inputValue} handleChange={handleChange} />
        <Button handleClick={handleClick} />
      </div>
    </div>
  );
};

export default AddCard;
