import { render } from "@testing-library/react";
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
    };
    this.update = this.update.bind(this);
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
    this.setState({
      ...this.state,
      TODO: await this.state.db.getCardsByStatusCodes(["TODO"]),
      IN_PROGRESS: await this.state.db.getCardsByStatusCodes(["IN_PROGRESS"]),
      DONE: await this.state.db.getCardsByStatusCodes(["DONE"]),
    });

    console.log(this.state);
  }

  render() {
    return (
      <div className="board">
        <Feature
          title={"To-do"}
          arr={this.state.TODO}
          db={this.state.db}
          update={this.update}
          status={"TODO"}
        />

        <VerticalPartition />

        <Feature
          title={"In Progress"}
          arr={this.state.IN_PROGRESS}
          db={this.state.db}
          update={this.update}
          status={"IN_PROGRESS"}
        />

        <VerticalPartition />

        <Feature
          title={"Done"}
          arr={this.state.DONE}
          db={this.state.db}
          update={this.update}
          status={"DONE"}
        />

        <AddCard db={this.state.db} update={this.update} />
        <DeleteCard/>
      </div>
    );
  }
}
