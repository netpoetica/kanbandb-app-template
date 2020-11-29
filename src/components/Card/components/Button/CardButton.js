import React from 'react';
import './CardButton.css'

const Button =({actionName,buttonColor, handleAction, cardId,cardStatus})=>{
    return (
    // <div className="cardbuttons">
<button  className={"cardButton"}  style={{backgroundColor:buttonColor}}
 onClick={(e)=>handleAction(e,actionName,cardId, cardStatus)}>{actionName}</button>
    // </div>
    )
}

export default Button;