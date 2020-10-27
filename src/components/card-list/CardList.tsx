import React from "react";
import { Droppable } from "react-beautiful-dnd";

import { Task } from "../../types";
import Card from "../card/Card";

import styles from "./CardList.module.scss";

export type Props = {
  id: string;
  tasks: Task[];
};

export default function CardList({ tasks, id }: Props): React.ReactElement {
  return (
    <Droppable droppableId={id}>
      {(provided): React.ReactElement => (
        <div
          data-testid="cardList"
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={styles.cardList}
        >
          {tasks.map((task: Task, index: number) => (
            <Card
              id={task.id}
              content={task.content}
              index={index}
              key={task.id}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
