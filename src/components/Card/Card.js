import React from 'react';
import './Card.css'

export default function Card (props){

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
                    <p className={"card__content"}>
                      {x.name} :{x.description}
                    </p>
                    {/* <div className={"card__delete"}></div> */}
                  </div>
                );
              })}
          </>
        );

    
}