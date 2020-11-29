import React from "react";
import "./CardButton.css";

const Button = ({
  actionName,
  buttonColor,
  handleAction,
  cardId,
  cardStatus,
  cardTitle,
  cardDesc,
}) => {
  return (
    <button
      className={"cardButton"}
      style={{ backgroundColor: buttonColor }}
      onClick={(e) =>
        handleAction(e, actionName, cardId, cardStatus, cardTitle, cardDesc)
      }
    >
      {actionName}
    </button>
  );
};

export default Button;
