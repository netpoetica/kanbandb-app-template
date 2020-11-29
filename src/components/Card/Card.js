import React,{useState} from "react";

import "./Card.css";
import CardButton from "./components/Button/CardButton";

export default function Card(props) {

const [editMode, setEditMode] = useState(false);

  const handleClick= (e,name,description,id)=>{
    setEditMode(true);
    const newName = prompt("enter the title/ name",name);
    const newDescription = prompt("enter the description",description);
    console.log(newName,newDescription);
  }

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
              <div className={`card__actionContainer ${props.options}`}>
              <CardButton actionName={"Edit"} buttonColor={'#ffdf00'} cardId={x.id} cardTitle={x.name} cardDesc={x.description} cardStatus={x.status} handleAction={props.handleAction}/>
              <CardButton actionName={"X"} buttonColor={"#e60000"} cardId={x.id} cardStatus={x.status} cardTitle={x.name} cardDesc={x.description}  handleAction={ props.handleAction}/>
              </div>
            </div>
          );
        })}
    </>
  );
}
