import React from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";

import { Task } from "../../types";

import styles from "./CardList.module.scss";

export type Props = {
  id: string;
  tasks: Task[];
  children: (task: Task, index: number) => React.ReactElement;
};

export function renderTasks(
  tasks: Props["tasks"],
  renderChildren: Props["children"]
): React.ReactNode {
  return tasks.map((task: Task, index: number) => renderChildren(task, index));
}

export function renderProvided(
  tasks: Props["tasks"],
  renderChildren: Props["children"]
) {
  return (provided: DroppableProvided): React.ReactElement => (
    <div
      data-testid="cardList"
      ref={provided.innerRef}
      {...provided.droppableProps}
      className={styles.cardList}
    >
      {renderTasks(tasks, renderChildren)}
      {provided.placeholder}
    </div>
  );
}

export default function CardList({
  tasks,
  id,
  children,
}: Props): React.ReactElement {
  return (
    <Droppable droppableId={id}>{renderProvided(tasks, children)}</Droppable>
  );
}
