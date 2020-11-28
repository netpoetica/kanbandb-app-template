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
      node: null,
      addCard: true,
      deleteCard: false,
      input: "",
      options:false,
    };
    this.update = this.update.bind(this);
    this.handleDragStartCard = this.handleDragStartCard.bind(this);
    this.handleDropCard = this.handleDropCard.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDropDeleteCard = this.handleDropDeleteCard.bind(this);
  }

  async componentDidMount() {
    try {
      console.log("mount");
      const db = await KabanService();
      console.log(await db.getCards());
      this.setState({
        ...this.state,
        TODO: await db.getCardsByStatusCodes(["TODO"]),
        IN_PROGRESS: await db.getCardsByStatusCodes(["IN_PROGRESS"]),
        DONE: await db.getCardsByStatusCodes(["DONE"]),
        db: db,
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  componentDidUpdate() {
    console.log("up");
  }

  async update() {
    console.log("update");
    try {
      let data = await this.state.db.getCards();
      console.log("data", data);
      if (data.length >= 1) {
        let a = await this.state.db.getCardsByStatusCodes(["TODO"]);
        let b = await this.state.db.getCardsByStatusCodes(["IN_PROGRESS"]);
        let c = await this.state.db.getCardsByStatusCodes(["DONE"]);

        this.setState({
          ...this.state,
          TODO:
            a.length > 2 ? a.sort((a, b) => a.lastUpdated - b.lastUpdated) : a,
          IN_PROGRESS:
            b.length > 2 ? b.sort((a, b) => a.lastUpdated - b.lastUpdated) : b,
          DONE:
            c.length > 2 ? c.sort((a, b) => a.lastUpdated - b.lastUpdated) : c,
        });
        console.log(this.state);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  handleDragStartCard = async (e, id) => {
    console.log('drag start card-----------------------')
    // this.setState({
    //   ...this.state,
    //   options:true
    // })
    
    e.persist();
    console.log("event target", e.target);
    this.setState({
      ...this.state,
      node: e.target,
      addCard: false,
      deleteCard: true,
      options:true
    });
    console.log(this.state);
    setTimeout(() => {
      e.target.style.display = "none";
    }, 0);
    e.dataTransfer.setData("id", id);
    console.log(e, id);
  };

  handleDropCard = async (e, status) => {
    try {
      let id = e.dataTransfer.getData("id");
      e.persist();
      let item = await this.state.db.getCardById(e.dataTransfer.getData("id"));
      console.log("itemData", item);
      let oldStatus = item.status;
      this.setState({
        ...this.state,
        addCard: true,
        deleteCard: false,
      });
      if (oldStatus !== status) {
        let update = await this.state.db.updateCardById(id, { status });
        console.log("update", update);
        this.update();
      } else {
        console.log("not updated", e.target);
        this.state.node.style.display = "flex";
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  handleChange = (e) => {
    let data = e.target.value;
    this.setState({
      ...this.state,
      input: data,
    });
  };

  handleClick = async (e) => {
    try {
      let inputData = this.state.input;
      if (
        inputData &&
        this.state.input.length >= 3 &&
        this.state.input.includes(":")
      ) {
        let data = this.state.input.split(":").map((str) => str.trim());
        console.log(data);
        await this.state.db.addCard({
          name: data[0],
          description: data[1],
          status: "TODO",
        });
        this.setState({
          ...this.state,
          input: "",
        });
        this.update();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  handleDropDeleteCard = async (e, del) => {
    try {
      console.log(e, del);
      let id = e.dataTransfer.getData("id");
      let s = await this.state.db.deleteCardById(id);
      console.log(id, s);
      this.setState({
        ...this.state,
        addCard: true,
        deleteCard: false,
      });
      this.update();
    } catch (err) {
      console.log(err.message);
    }
  };

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
        />

        <VerticalPartition />

        <Feature
          title={"In Progress"}
          arr={this.state.IN_PROGRESS}
          status={"IN_PROGRESS"}
          handleDragStart={this.handleDragStartCard}
          handleDrop={this.handleDropCard}
        />

        <VerticalPartition />

        <Feature
          title={"Done"}
          arr={this.state.DONE}
          status={"DONE"}
          handleDragStart={this.handleDragStartCard}
          handleDrop={this.handleDropCard}
        />

        <AddCard
          handleClick={this.handleClick}
          handleChange={this.handleChange}
          addCard={this.state.addCard}
          inputValue={this.state.input}
        />
        <DeleteCard
          handleDropDeleteCard={this.handleDropDeleteCard}
          deleteCard={this.state.deleteCard}
        />
      </div>
    );
  }
}
