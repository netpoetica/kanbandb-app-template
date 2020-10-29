import React from "react";
import { Draggable } from "react-beautiful-dnd";

import styles from "./Card.module.scss";

import { Category } from "../../types";
import { defaultCategoryColors } from "../../config";

export type Props = {
  id: string;
  content: string;
  index: number;
  title: Category;
  onDelete: () => void;
};

export default function Card({
  id,
  content,
  title,
  index,
  onDelete,
}: Props): React.ReactElement {
  const category = defaultCategoryColors.find((x) => x.label === title);
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
          <span
            style={
              (category && { backgroundColor: category.color }) || undefined
            }
          >
            {title}
          </span>
          <p>{content}</p>
          <button data-testid="deleteButton" onClick={(): void => onDelete()}>
            X
          </button>
        </div>
      )}
    </Draggable>
  );
}
