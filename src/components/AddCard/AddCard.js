import React from 'react';
import './AddCard.css'
import Button from './components/Button/Button';
import TextInput from './components/TextInput/TextInput';
import './AddCard.css'
import {useState} from 'react';


const  AddCard = ({addCard ,handleChange,handleClick})=>{
    // const [state,setState] = useState("");

    // const handleChange = (e) =>{
    //      let data = e.target.value;
    //      setState(data);
    //     // console.log(e.target.name,value);
    // }


    // const clicked = async (e)=>{
    //     // e.preventDefault();
    //     // console.log(state);
    //     let data = state.split(":");
    //     console.log(data);
    //     await db.addCard({
    //         name:data[0],
    //         description:data[1],
    //         status:"TODO"
    //     })
    //     update();
    // }
    // console.log(add);
    return (
        <div className={`addCard ${addCard}`}>
        <div className="addCard__container">
        <TextInput handleChange = {handleChange}/>
        <Button handleClick = {handleClick}/>
        </div>
        </div>
    )
} 

export default AddCard;