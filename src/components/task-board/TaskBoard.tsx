import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import { Board } from "../../types";

import styles from "./TaskBoard.module.scss";

export type Props = {
  onDragEnd: (result: DropResult) => void;
  boards: Board[];
  children: (id: Board["id"], tasks: Board["tasks"]) => React.ReactElement;
};

export default function TaskBoard({
  onDragEnd,
  boards,
  children,
}: Props): React.ReactElement {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div data-testid="taskBoard" className={styles.taskBoard}>
        {boards.map(({ id, label, tasks }) => (
          <div data-testid="board" key={id}>
            <h2>{label}</h2>
            {children(id, tasks)}
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
