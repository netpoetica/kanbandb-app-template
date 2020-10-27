import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import CardList from "../card-list/CardList";
import { Board } from "../../types";

import styles from "./TaskBoard.module.scss";

export type Props = {
  onDragEnd: (result: DropResult) => void;
  boards: Board[];
};

export default function TaskBoard({
  onDragEnd,
  boards,
}: Props): React.ReactElement {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.taskBoard}>
        {boards.map(({ id, label, tasks }) => (
          <div data-testid="board" key={id}>
            <h2>{label}</h2>
            <CardList id={id} tasks={tasks} />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
