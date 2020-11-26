import React, { Component } from "react";
import Feature from "../../components/Feature/Feature";
import VerticalPartition from "../../components/VerticalPartition/VerticalPartition";
import "./Board.css";
import KabanService from "../../services/API_KabanDB";
import AddCard from "../../components/AddCard/AddCard";
import DeleteCard from "../../components/DeleteCard/DeleteCard";

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
      db: null,
      node :null,
      addCard:true,
      deleteCard:false,
      input:null
    };
    this.update = this.update.bind(this);
    this.handleDragStartCard = this.handleDragStartCard.bind(this);
    this.handleDropCard = this.handleDropCard.bind(this);
    this.handleChange= this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDropDeleteCard = this.handleDropDeleteCard.bind(this);
  }

  async componentDidMount() {
    console.log("mount");
    const db = await KabanService();

    console.log(await db.getCards());
    // console.log( await db.getCardsByStatus("TODO"));

    this.setState({
      ...this.state,
      TODO: await db.getCardsByStatusCodes(["TODO"]),
      IN_PROGRESS: await db.getCardsByStatusCodes(["IN_PROGRESS"]),
      DONE: await db.getCardsByStatusCodes(["DONE"]),
      db: db,
    });
  }

  async update() {
    console.log("update");
    let a =await this.state.db.getCardsByStatusCodes(["TODO"]);
    let b = await this.state.db.getCardsByStatusCodes(["IN_PROGRESS"]);
    let c =await this.state.db.getCardsByStatusCodes(["DONE"]);
    this.setState({
      ...this.state,
      TODO: a.sort((a,b)=>a.lastUpdated-b.lastUpdated),
      IN_PROGRESS: b.sort((a,b)=>a.lastUpdated-b.lastUpdated),
      DONE: c.sort((a,b)=>a.lastUpdated-b.lastUpdated),
    });

    console.log(this.state);
  }


   handleDragStartCard =async (e,id)=>{   
    e.persist();
    console.log('event target',e.target);
    this.setState({
        ...this.state,
        node:e.target,
        addCard:false,
        deleteCard:true
    })
    setTimeout(()=>{    
        e.target.style.display="none"
    },0);
    // console.log(props.db.getCardById(id));
    e.dataTransfer.setData("id",id);
    console.log(e,id);
    // let item = await props.db.getCardById(id);
    
    
}

 handleDropCard = async (e,status)=>{
    // console.log('drop')
    // e.preventDefault();
    // console.log('drop',e,status);
    let id = e.dataTransfer.getData("id");
    e.persist();
    // console.log('drop',e);
    // console.log('item',e.dataTransfer.getData("id"),status);
    // console.log(this.state.node);
    let item = await this.state.db.getCardById(e.dataTransfer.getData("id"));
    console.log('itemData',item);
    // console.log(item.status);
    let oldStatus = item.status;
    // console.log('props',props)
    // item.status = status;
    this.setState({
        ...this.state,
        addCard:true,
        deleteCard:false
    })
    if(oldStatus!==status){
        let update = await this.state.db.updateCardById(id,{status});
        console.log('update',update);
        this.update();    
    }
    else{
        console.log('not updated',e.target);
        this.state.node.style.display="block";
    }
  
}

 handleChange = (e) =>{
    let data = e.target.value;
    this.setState({
        ...this.state,
        input:data,
    })
}


 handleClick = async (e)=>{

   let data = this.state.input.split(":");
   console.log(data);
   await this.state.db.addCard({
       name:data[0],
       description:data[1],
       status:"TODO"
   })
   this.update();
}



 handleDropDeleteCard = async(e,del) =>{
    console.log(e,del);
    let id = e.dataTransfer.getData("id");
   let s= await this.state.db.deleteCardById(id);
    console.log(id,s);
   this.update();
   
}


  render() {
    return (
      <div className="board">
        <Feature
          title={"To-do"}
          arr={this.state.TODO}
          status={"TODO"}
          handleDragStart={this.handleDragStartCard}
          handleDrop = {this.handleDropCard}
        />

        <VerticalPartition />

        <Feature
          title={"In Progress"}
          arr={this.state.IN_PROGRESS}
          status={"IN_PROGRESS"}
          handleDragStart={this.handleDragStartCard}
          handleDrop = {this.handleDropCard}
        />

        <VerticalPartition />

        <Feature
          title={"Done"}
          arr={this.state.DONE}
          status={"DONE"}
          handleDragStart={this.handleDragStartCard}
          handleDrop = {this.handleDropCard}
        />

        <AddCard  handleClick={this.handleClick} handleChange= {this.handleChange} addCard ={this.state.addCard} />
        <DeleteCard handleDropDeleteCard={this.handleDropDeleteCard} deleteCard={this.state.deleteCard}/>
      </div>
    );
  }
}
