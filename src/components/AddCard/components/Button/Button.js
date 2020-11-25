import React from 'react';
import './Button.css';
const  Button = ({handleClick })=>{

  
    return (
        <button type="button" className="button" onClick={handleClick }><p>Add New</p>  </button>        
    )
}


export default Button;