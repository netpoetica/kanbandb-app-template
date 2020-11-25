import React from 'react';
import './Card.css'

export default function Card (props){
    let a =1;
    // const handleDragStart = (e,name)=>{   
    //     // e.preventDefault();
    //     e.persist();
    //     // console.log(e.target);
        
    //     setTimeout(()=>{    
    //         // e.target.className.display="none";
            
    //         e.target.style.display="none"
    //         // console.log(++a,e.target);
    //         e.dataTransfer.setData("name",name);
    //         console.log(name);
    //     },0);

    // }
    
    

    // function handleDragOver (e){
    //     console.log(e.target);
    // }

   

        // return (
        //     <div className="cardContainer">
        //      {props.data && props.data.map((x,i)=>{
        //    return  <div draggable='true' section ={props.section} onDragOver={handleDragStart} onDrop={handleDragEnd} key = {i} className='card' >
        //            <p className={'card__content'}>{x.name} :{x.description}</p> 
        //      </div>
        //          })}
        //     </div>    
        // )

        // return (
        //     <>
        //      {/*<div className="cardContainer">*/}
        //      {props.data && props.data.map((x,i)=>{
        //    return  <div  draggable='true'  section ={props.section}  onDragStart={(e)=>handleDragStart(e,x.name)} onDragEnd={handleDragOver}   key = {i} className='card' >
        //            <p className={'card__content'}>{x.name} :{x.description}</p> 
        //      </div>
        //          })}
        //     {/* </div> */}
        //     </>   
        // )

        return (
            <>
             {/*<div className="cardContainer">*/}
             {props.data && props.data.map((x)=>{
           return  <div  draggable='true' id={x.id}  onDragStart={(e)=>props.ds(e,x.id)}  key = {x.id} className='card' >
                   <p className={'card__content'}>{x.name} :{x.description}</p> 
             </div>
                 })}
            {/* </div> */}
            </>   
        )

    
}