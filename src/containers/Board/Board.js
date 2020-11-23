import React from 'react';
import Feature from '../../components/Feature/Feature';
import VerticalPartition from '../../components/VerticalPartition/VerticalPartition';
import './Board.css';
 export default function Board () {
    return (
        <div className = "board"> 
            <Feature title={"To-do"} 
            arr={[{name:"Test",description:"Write tests for Textfield"},
            {name:"Bug",description:"dsadasfasfsasadsa"},
            {name:"Refactor",description:"dsadasfasfsasadsa"}]} section={"normal"}/>
            <VerticalPartition/>
            <Feature title={"In Progress"} arr={[{name:"Bug",description:"dsadasfasfsasadsa"},
            {name:"Test",description:"dsadasfasfsasadsa"}]}  section={"middle"}/>
            <VerticalPartition/>
            <Feature title={"Done"} arr={[{name:"Enhasment",description:"RatingField to have skip"}]}  section={"normal"}/>
        </div>
    )
};

