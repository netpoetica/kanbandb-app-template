import React from 'react';
import './Card.css'
export default function Card (props){

        return (
            <div className="cardContainer">
             {props.data && props.data.map((x,i)=>{
           return  <div key = {i} className='card'>
                   <p className={'card__content'}>{x.name} :{x.description}</p> 
             </div>
                 })}
            </div>    
        )

    
}