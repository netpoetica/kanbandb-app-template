import React from 'react';
import './TextInput.css'

const TextInput = ({handleState}) =>{
    return (
        <input type="text" name ="cardData"
        placeholder= {"eg like this"} onChange ={handleState}
         className = "textInput">
        </input>
    )
}

export default TextInput;