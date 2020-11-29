import React, { Component } from "react";
import Feature from "../../components/Feature/Feature";
import VerticalPartition from "../../components/VerticalPartition/VerticalPartition";
import "./Board.css";
import KabanService from "../../services/API_KabanDB";
import AddCard from "../../components/AddCard/AddCard";
import Modal from "../../components/Modal/Modal";

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
      db: null,
      node: null,
      // addCard: true,
      // deleteCard: false,
      input: "",
      options: true,
      modalView:false,
      currentTitle:"",
      currentDescription:"",
      currentId:""
    };

    this.handleDragStartCard = this.handleDragStartCard.bind(this);
    this.handleDropCard = this.handleDropCard.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleAddCard = this.handleAddCard.bind(this);
    // this.handleDropDeleteCard = this.handleDropDeleteCard.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
  }

  async componentDidMount() {
    try {
      console.log("mount");
      const db = await KabanService();
      console.log(await db.getCards());
      this.setState({
        ...this.state,
        data: await db.getCards(),
        TODO: await db.getCardsByStatusCodes(["TODO"]),
        IN_PROGRESS: await db.getCardsByStatusCodes(["IN_PROGRESS"]),
        DONE: await db.getCardsByStatusCodes(["DONE"]),
        db: db,
      });
      console.log(this.state);
    } catch (err) {
      console.log(err.message);
    }
  }

  componentDidUpdate() {
    console.log("up");
  }


  handleDragStartCard = async (e, id) => {
    e.persist();
    console.log("event target", e.target);
    this.setState({
      ...this.state,
      node: e.target,
      // addCard: false,
      // deleteCard: true,
      options: false,
    });
    console.log(this.state);
    setTimeout(() => {
      e.target.style.display = "none";
    }, 0);
    e.dataTransfer.setData("id", id);
    console.log(e, id);
  };

  handleDropCard = async (e, status) => {
    e.persist();
    // console.log("handle drop", e, status);
    try {
      let id = e.dataTransfer.getData("id");
      let item = await this.state.db.getCardById(id);
      console.log("itemData", item);
      let oldStatus = item.status;
      this.setState({
        ...this.state,
        options: true,
      });

      if (oldStatus !== status) {
        let update = await this.state.db.updateCardById(id, { status });
        let updatedData = await this.state.db.getCardById(id);
        console.log("object", update, updatedData);
        if (update) {
          this.removeItem(oldStatus, id);
          this.addItem(status, updatedData);
        }

        // this.update();
        console.log("update called", this.state);
      } else {
        console.log("not updated", e.target);
        this.state.node.style.display = "flex";
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  handleChangeInput = (e) => {
    let data = e.target.value;
    this.setState({
      ...this.state,
      input: data,
    });
  };

  handleAddCard = async (e) => {
    try {
      let inputData = this.state.input;
      if (
        inputData &&
        this.state.input.length >= 3 &&
        this.state.input.includes(":")
      ) {
        let data = this.state.input.split(":").map((str) => str.trim());
        console.log(data);
        this.setState({
          ...this.state,
          input: "",
        });
        let addedDataId = await this.state.db.addCard({
          name: data[0],
          description: data[1],
          status: "TODO",
        });

        const newData = await this.state.db.getCardById(addedDataId);
        console.log("dataadded", newData);

        if (newData) {
          this.addItem("TODO", newData);
        }else{
          alert("error adding new Card");
        }
       
      } else {
        alert("provide a valid input minimum 3 charactes separated with : ");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  // handleDropDeleteCard = async (e, del) => {
  //   try {
  //     console.log(e, del);
  //     let id = e.dataTransfer.getData("id");
  //     let s = await this.state.db.deleteCardById(id);
  //     console.log(id, s);
  //     this.setState({
  //       ...this.state,
  //       addCard: true,
  //       deleteCard: false,
  //     });
  //     this.update();
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // };

  handleAction = async (e, actionName, id, status,title,description) => {
    console.log("handle action", e, actionName, id,status,title,description);
    try {
      if (actionName === "Edit") {
        console.log("working");
        this.setState({
          ...this.state,
          modalView:true,
          currentTitle:title,
          currentDescription:description,
          currentId:id,
        })
        
        // const newName = prompt("Enter Title: ",title);
        // const newDescription = prompt("Enter Description : ",description);
        // if(newName && newDescription){
        // const update = await this.state.db.updateCardById(id,{name:newName,description:newDescription});
        // console.log(e,newName,newDescription,id);
        //   let newData = await this.state.db.getCardById(id);
        //   console.log('from db',newData);
        //   this.updateItem(newData.status,id,newData);
        // }
        // else{
        //   return;
        // }
       
      } else {
        const deleted = await this.state.db.deleteCardById(id);
        if (deleted) {
          this.removeItem(status, id);
        }
        console.log(id, deleted, this.state);
      }
      console.log("from db", await this.state.db.getCards());
    } catch (err) {
      console.log(err.message);
    }
  };

  removeItem = (oldStatus, id) => {
    switch (oldStatus) {
      case "TODO":
        this.setState({
          ...this.state,
          TODO: this.state.TODO.filter((x) => x.id !== id),
        });
        break;
      case "IN_PROGRESS":
        this.setState({
          ...this.state,
          IN_PROGRESS: this.state.IN_PROGRESS.filter((x) => x.id !== id),
        });

        break;
      case "DONE":
        this.setState({
          ...this.state,
          DONE: this.state.DONE.filter((x) => x.id !== id),
        });
        break;
      default:
        return;
    }
    return;
  };

  addItem = (status, updatedData) => {
    // console.log('add here',status,updatedData,this.state.IN_PROGRESS);
    switch (status) {
      case "TODO":
        this.setState({
          ...this.state,
          TODO: [...this.state.TODO, updatedData],
        });
        break;
      case "IN_PROGRESS":
        this.setState({
          ...this.state,
          IN_PROGRESS: [...this.state.IN_PROGRESS, updatedData],
        });
        break;
      case "DONE":
        this.setState({
          ...this.state,
          DONE: [...this.state.DONE, updatedData],
        });
        break;
      default:
        return;
    }

    return;
  };

  updateItem = (status, id, data) => {
    console.log('update item reducer',status,id,data );
    switch (status) {
      case "TODO":
        this.setState({
          ...this.state,
          TODO: this.state.TODO.map((x) => { if(x.id === id){ return data }
            else{
              return x;
            }}),
        });
        break;
      case "IN_PROGRESS":
        this.setState({
          ...this.state,
          IN_PROGRESS: this.state.IN_PROGRESS.map((x) => { if(x.id === id){ return data }
          else{
            return x;
          }}),
      });
        break;
      case "DONE":
        this.setState({
          ...this.state,
          DONE: this.state.DONE.map((x) => { if(x.id === id){ return data }
          else{
            return x;
          }}),
      });
        break;
      default:
        return;
    }
    return;
  };


  handleCloseModal =() =>{
    this.setState({
      ...this.state,
      modalView :false,
    })
  }

  handleSubmitModal = async(e)=>{
    e.preventDefault();
    e.persist();
    // console.log({title:e.target.title.value,description:e.target.description.value})
    try{  
      const updateItem = await this.state.db.updateCardById(this.state.currentId,{name:e.target.title.value,description:e.target.description.value})
      const updatedItem = await this.state.db.getCardById(this.state.currentId);
      console.log('db',updatedItem);
      this.updateItem(updatedItem.status,this.state.currentId,updatedItem);
    }catch(err){
      console.log(err.message)
    }
    this.setState({
      ...this.state,
      currentTitle:"",
      currentDescription:"",
      currentId:"",
      modalView:false
    })
    console.log(this.state);
    console.log(e.target.title.value);
  } 


  render() {
    return (
      <div className="board">
        <Feature
          title={"To-do"}
          arr={this.state.TODO}
          status={"TODO"}
          handleDragStart={this.handleDragStartCard}
          handleDrop={this.handleDropCard}
          options={this.state.options}
          handleAction={this.handleAction}
        />

        <VerticalPartition />

        <Feature
          title={"In Progress"}
          arr={this.state.IN_PROGRESS}
          status={"IN_PROGRESS"}
          handleDragStart={this.handleDragStartCard}
          handleDrop={this.handleDropCard}
          options={this.state.options}
          handleAction={this.handleAction}
        />

        <VerticalPartition />

        <Feature
          title={"Done"}
          arr={this.state.DONE}
          status={"DONE"}
          handleDragStart={this.handleDragStartCard}
          handleDrop={this.handleDropCard}
          options={this.state.options}
          handleAction={this.handleAction}
        />

        <AddCard
          handleClick={this.handleAddCard}
          handleChangeInput={this.handleChangeInput}
          inputValue={this.state.input}
        />

         {this.state.modalView && <Modal handleCloseModal={this.handleCloseModal} name={this.state.currentTitle}
            description={this.state.currentDescription } handleSubmitModal={this.handleSubmitModal} 
         />}
      </div>
    );
  }
}
