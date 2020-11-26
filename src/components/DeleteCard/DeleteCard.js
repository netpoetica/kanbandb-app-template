import React, { useState } from "react";
import "./DeleteCard.css";

const DeleteCard = ({ deleteCard, handleDropDeleteCard }) => {
  const [style, setStyle] = useState("");
  const handleDragOver = (e) => {
    e.preventDefault();
    setStyle("over");
  };

  const handleDragEnd = (e) => {
    console.log("end");
    setStyle("");
  };

  return (
    <div
      className={`deleteCard ${style} ${deleteCard}`}
      onDragLeave={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDropDeleteCard(e, null)}
    >
      <div className="deleteCard__holder">
        <p className="deleteCard__sign">X</p>
      </div>
    </div>
  );
};

export default DeleteCard;
