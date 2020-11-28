import React from 'react';
import './CardButton.css'

const Button =({actionName,buttonColor})=>{
    return (
    // <div className="cardbuttons">
<button  className={"cardButton"}  style={{backgroundColor:buttonColor}}
 onClick={()=>{console.log(actionName);}}>{actionName}</button>
    // </div>
    )
}

export default Button;