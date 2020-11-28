import React from "react";

import "./Card.css";
import CardButton from "./components/Button/CardButton";

export default function Card(props) {
  return (
    <>
      {props.data &&
        props.data.map((x) => {
          return (
            <div
              draggable="true"
              id={x.id}
              onDragStart={(e) => props.ds(e, x.id)}
              key={x.id}
              className="card"
            >
              <p>
                {x.name}: {x.description}
              </p>
              <div className={`card__actionContainer `}>
              <CardButton actionName={"Edit"} buttonColor={'yellow'}/>
              <CardButton actionName={"X"} buttonColor={"red"}/>
              </div>
            </div>
          );
        })}
    </>
  );
}
