import React from "react";
import { Droppable } from "react-beautiful-dnd";

import { Task } from "../../types";

import styles from "./CardList.module.scss";

export type Props = {
  id: string;
  tasks: Task[];
  children: (task: Task, index: number) => React.ReactElement;
};

export default function CardList({
  tasks,
  id,
  children,
}: Props): React.ReactElement {
  return (
    <Droppable droppableId={id}>
      {(provided): React.ReactElement => (
        <div
          data-testid="cardList"
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={styles.cardList}
        >
          {tasks.map((task: Task, index: number) => children(task, index))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
