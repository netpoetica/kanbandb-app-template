import React from "react";
import "./AddCard.css";
import Button from "./components/Button/Button";
import TextInput from "./components/TextInput/TextInput";
import "./AddCard.css";

const AddCard = ({ handleChangeInput, handleClick, inputValue }) => {
  return (
    <div className={`addCard`}>
      <div className="addCard__container">
        <TextInput
          inputValue={inputValue}
          handleChangeInput={handleChangeInput}
        />
        <Button handleClick={handleClick} />
      </div>
    </div>
  );
};

export default AddCard;
