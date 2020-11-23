import React from 'react';
import Card from '../Card/Card';
import './Feature.css'
export default function Feature (props){
    return (
        <div className={`feature ${props.section}`}>
            <h3 className={`feature__title`}>{props.title}</h3>
                <Card className="feature__cardContainer" data = {props.arr}/>
        </div>
    )
}