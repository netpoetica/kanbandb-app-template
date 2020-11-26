import React, {useState}from 'react';
import './DeleteCard.css';

const DeleteCard = ({deleteCard,handleDropDeleteCard})=>{
    const [style,setStyle] = useState({a:null});
    const handleDragOver = (e)=>{
        e.preventDefault()
        // console.log(++a);
        setStyle({a:"over"});
    }

    const handleDrop =(e,del) =>{
        console.log(e,del);
       
    }

    const handleDragEnd = (e)=>{
        console.log('end');
        setStyle({a:""});
    }

    

    
    return (
        <div className={`deleteCard ${style.a} ${deleteCard}`} onDragLeave ={handleDragEnd} onDragOver={handleDragOver} onDrop={(e)=>handleDropDeleteCard(e,null)}>
        <div className="deleteCard__holder">
        <p className="deleteCard__sign">X</p>
        </div>
        </div>
    )
}

export default DeleteCard;