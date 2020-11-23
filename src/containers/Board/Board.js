import React from 'react';
import Feature from '../../components/Feature/Feature';
import './Board.css';
 export default function Board () {
    return (
        <div className = "board"> 
            <Feature title={"To-do"} 
            arr={[{name:"test",description:"write tests for the Textfield"},
            {name:"bug",description:"dsadasfasfsasadsa"},
            {name:"refactor",description:"dsadasfasfsasadsa"}]} section={"normal"}/>
            <Feature title={"In Progress"} arr={[{name:"Bug",description:"dsadasfasfsasadsa"},
            {name:"test",description:"dsadasfasfsasadsa"}]}  section={"middle"}/>
            <Feature title={"Done"} arr={[{name:"enhasment",description:"dsadasfasfsasadsa"}]}  section={"normal"}/>
        </div>
    )
};

