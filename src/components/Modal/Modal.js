import React, { useState } from "react";
import "./Modal.css";

export default function Modal({
  handleCloseModal,
  name,
  description,
  handleSubmitModal,
}) {
  const [inputs, setInputs] = useState({
    name,
    description,
  });
  const handleOnChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="modal">
      <div className="modal__container">
        <h3>Edit Card</h3>
        <form onSubmit={handleSubmitModal} className="modal__form">
          <label htmlFor="name">Name :</label>
          <input
            type="text"
            name="name"
            defaultValue={inputs.name}
            onChange={handleOnChange}
          ></input>
          <label htmlFor="description">Description : </label>
          <input
            type="text"
            name="description"
            defaultValue={inputs.description}
            onChange={handleOnChange}
          ></input>
          <button type="submit">UPDATE</button>
        </form>
        <button onClick={(e) => handleCloseModal(e)} className="modal__cancel">
          x
        </button>
      </div>
    </div>
  );
}
