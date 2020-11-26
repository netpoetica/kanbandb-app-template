import React from 'react';
import './AddCard.css'
import Button from './components/Button/Button';
import TextInput from './components/TextInput/TextInput';
import './AddCard.css'
import {useState} from 'react';


const  AddCard = ({db,update})=>{
    const [state,setState] = useState("");

    const handleChange = (e) =>{
         let data = e.target.value;
         setState(data);
        // console.log(e.target.name,value);
    }


    const clicked = async (e)=>{
        // e.preventDefault();
        // console.log(state);
        let data = state.split(":");
        console.log(data);
        await db.addCard({
            name:data[0],
            description:data[1],
            status:"TODO"
        })
        update();
    }

    return (
        <div className="addCard">
        <div className="addCard__container">
        <TextInput handleState = {handleChange}/>
        <Button handleClick = {clicked}/>
        </div>
        </div>
    )
} 

export default AddCard;