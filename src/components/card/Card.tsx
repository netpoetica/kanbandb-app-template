import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styles from "./Card.module.scss";

export type Props = {
  id: string;
  content: string;
  index: number;
};

export default function Card({
  id,
  content,
  index,
}: Props): React.ReactElement {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided): React.ReactElement => (
        <div
          data-testid="card"
          className={styles.card}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {content}
        </div>
      )}
    </Draggable>
  );
}
