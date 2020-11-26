import React from "react";
import Card from "../Card/Card";
import "./Feature.css";

export default function Feature(props) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className={`feature ${props.section}`}>
      <h3 className={`feature__title`}>{props.title}</h3>
      <div
        className="feature__cardContainer"
        onDragOver={handleDragOver}
        onDrop={(e) => props.handleDrop(e, props.status)}
      >
        <Card
          section={props.section}
          data={props.arr}
          ds={(e, name) => props.handleDragStart(e, name)}
        />
      </div>
    </div>
  );
}
