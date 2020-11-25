import React from 'react';
import Card from '../Card/Card';
import './Feature.css'
import { useState} from 'react';


export default function Feature (props){
    // console.log(props);
    // const handleDragStart = (e)=>{   
    //     // e.preventDefault();
    //     console.log(e);

    // }
    
    // const handleDragEnd = (e)=>{   
    //     // e.preventDefault();
    //     console.log('ct',e.currentTarget,'dt',e.dataTransfer,'t',e.target.parentNode);

    // }

    const [element,setElement] = useState({id:null});

    // const dropped = (e)=>{
    //     e.preventDefault();
    //     // const data = e.dataTransfer.getData('transfer');
    //     // e.target.appendChild(document.getElementById(data));
    //     // console.log(e.target); 
    //    }
    //   const dragover = (e)=>{
    //     // e.currentTarget.append(e.value);
    //     // e.preventDefault();
    //       console.log('dragover',e.target);
    //     //   e.target.appendNode(element);
    //     // e.target.append(element);
    //     console.log(element);
    //   } 
    //   function handleDragStart (e){
    //     console.log('dragStart',e.target);
    //    setElement(e.target);
    // }
    // return (
        
    //     <div className={`feature ${props.section}`}  >
    //         <h2 className={`feature__title`}>{props.title}</h2>
    //             <div className="feature__cardContainer" onDrop={dropped} status={props.title} onDragOver={dragover} onDragStart={handleDragStart

    //             }>
    //             <Card   section={props.section}  data = {props.arr}/>
    //             {props.children}
    //             </div>
    //     </div>
    // )
    // let temp =null ;

    const handleDragStart =async (e,id)=>{   
            e.persist();
            console.log(e.target);
            
            setTimeout(()=>{    
                e.target.style.display="none"
            },0);
            // console.log(props.db.getCardById(id));
            e.dataTransfer.setData("id",id);
            console.log(e,id);
            // let item = await props.db.getCardById(id);
            
            
        }

    const handleDrop = async (e,status)=>{
        // e.preventDefault();
        console.log(e,status);
        let id = e.dataTransfer.getData("id");
        e.persist();
        console.log('drop',e);
        console.log('item',e.dataTransfer.getData("id"),status);
        console.log(element);
        let item = await props.db.getCardById(e.dataTransfer.getData("id"));
        console.log('itemData',item);
        // console.log(item.status);
        let oldStatus = item.status;
        console.log('props',props)
        item.status = status;
        let update = await props.db.updateCardById(id,{status});
        console.log('update',update);
        props.update();
        // let allcard = await props.db.getCards();
        // console.log(allcard);        

        // props.dbupdateCardById(id, cardData).then;
        // console.log('data transfer get data',e.dataTransfer.getData("name"));
    }

    const handleDragOver = (e)=>{
        e.preventDefault();
    }

    // const handleDragEnd = (e)=>{   
    //     // e.preventDefault();
    //     console.log('copied node',element);
    //     console.log('ct',e.currentTarget,'dt',e.dataTransfer,'t',e.target.parentNode);
    // }
    // console.log('temp',temp);

    return (
        
        <div className={`feature ${props.section}`}   >
            <h2 className={`feature__title`}>{props.title}</h2>
                <div className="feature__cardContainer"   onDragOver={handleDragOver} onDrop={(e)=>handleDrop(e,props.status)}>
                <Card   section={props.section}  data = {props.arr} ds={(e,name)=>handleDragStart(e,name)} />
                
                </div>
        </div>
    )
}