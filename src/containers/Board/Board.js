import { render } from '@testing-library/react';
import React, { Component } from 'react';
import Feature from '../../components/Feature/Feature';
import VerticalPartition from '../../components/VerticalPartition/VerticalPartition';
import './Board.css';
import KabanService from '../../services/API_KabanDB';
import AddCard from '../../components/AddCard/AddCard';

// import db from '../../KabanDB/index';

// import initialize from '../../services/API_KabanDB';

// import {useEffect} from 'react';

// export default function Board () {
//     useEffect(()=>{
//         console.log('1')
//       })
//     //   // Initialize DB communications.
//     //   console.log('object')
//     //     initialize();
//     return (
//         <div className = "board"> 
//             <Feature title={"To-do"} 
//             arr={[{name:"Test",description:"Write tests for Textfield"},
//             {name:"Bug",description:"dsadasfasfsasadsa"},
//             {name:"Refactor",description:"dsadasfasfsasadsa"}]} section={"normal"}/>
//             <VerticalPartition/>
//             <Feature title={"In Progress"} arr={[{name:"Bug",description:"dsadasfasfsasadsa"},
//             {name:"Test",description:"dsadasfasfsasadsa"}]}  section={"middle"}/>
//             <VerticalPartition/>
//             <Feature title={"Done"} arr={[{name:"Enhasment",description:"RatingField to have skip"}]}  section={"normal"}/>
//         </div>
//     )
// };



export default class Board extends Component  {
    constructor(props){
        super(props);
        this.state={
            TODO:[],
            IN_PROGRESS:[],
            DONE:[],
            db:null
        }
        this.update = this.update.bind(this);
    }

    async componentDidMount(){
        console.log('mount')
        // let a =[];
        // let b =[];
        // let c =[];

        // db().then(async x=>{
        //    a= await x.getCardsByStatusCodes(['TODO']);
        //    b= await x.getCardsByStatusCodes(['IN_PROGRESS']);
        //    c= await x.getCardsByStatusCodes(['DONE']);
        //    this.setState({
        //        TODO:[...a],
        //        IN_PROGRESS:[...b],
        //        DONE:[...c]
        //    })
        // });
        const {db}=  await KabanService();
       
      console.log(await db.getCards());  
        // console.log( await db.getCardsByStatus("TODO"));

        this.setState({
            ...this.state,
            TODO: await db.getCardsByStatusCodes(["TODO"]),
            IN_PROGRESS: await db.getCardsByStatusCodes(["IN_PROGRESS"]),
            DONE:await db.getCardsByStatusCodes(["DONE"]),
            db:db
        })

        // let x = this.props.db;
        // console.log('instance',);
        // x.getCardsByStatusCodes(['DONE']).then(console.log)
        // const set = async () =>{
        //     a= await x.getCardsByStatusCodes(['TODO']);
        //     b= await x.getCardsByStatusCodes(['IN_PROGRESS']);
        //     c= await x.getCardsByStatusCodes(['DONE']);
        //     this.setState({
        //         TODO:[...a],
        //         IN_PROGRESS:[...b],
        //         DONE:[...c]
        //     })
        //  };
        //  set();


 
    }

    async update (){
    console.log('update');
// console.log(this.state)
    this.setState({
        ...this.state,
        TODO: await this.state.db.getCardsByStatusCodes(["TODO"]),
        IN_PROGRESS: await this.state.db.getCardsByStatusCodes(["IN_PROGRESS"]),
        DONE: await this.state.db.getCardsByStatusCodes(["DONE"])
    })

    console.log(this.state);


   }

    

    render(){

    return (
        <div className = "board"> 
            <Feature title={"To-do"} 
            arr= {this.state.TODO}
            db={this.state.db}
            update={this.update}
             status={"TODO"}/>
             
            
            <VerticalPartition/>

            <Feature title={"In Progress"}
              arr= {this.state.IN_PROGRESS}
              db={this.state.db}
              update={this.update}
             status={"IN_PROGRESS"}/>

            <VerticalPartition/>

            <Feature title={"Done"} 
            arr= {this.state.DONE}
            db={this.state.db}
            update={this.update}
             status={"DONE"}/>

<AddCard db={this.state.db}  update={this.update}/>
        </div>
    )
    }
};
