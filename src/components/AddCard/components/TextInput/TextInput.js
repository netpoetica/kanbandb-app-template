import React from 'react';
import './TextInput.css'

const TextInput = ({handleChange}) =>{
    return (
        <input type="text" name ="cardData"
        placeholder= {"eg like this"} onChange ={handleChange}
         className = "textInput">
        </input>
    )
}

export default TextInput;