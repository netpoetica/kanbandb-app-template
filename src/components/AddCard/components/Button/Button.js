import React from 'react';
import './Button.css';
const  Button = ({handleClick })=>{

  
    return (
        <button type="button" className="button" onClick={handleClick }><p>ADD NEW</p>  </button>        
    )
}


export default Button;