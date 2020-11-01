import React from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";

import styles from "./Card.module.scss";

import { Category, CategoryOption } from "../../types";
import { defaultCategoryColors } from "../../config";

export type Props = {
  id: string;
  content: string;
  index: number;
  title: Category;
  onDelete: () => void;
};

export function renderProvided(
  id: Props["id"],
  title: Props["title"],
  content: Props["content"],
  onDelete: Props["onDelete"],
  category?: CategoryOption
) {
  return (provided: DraggableProvided): React.ReactElement => (
    <div
      data-testid="card"
      data-card-id={id}
      className={styles.card}
      ref={provided.innerRef}
      {...provided.dragHandleProps}
      {...provided.draggableProps}
    >
      <span
        data-testid="category"
        style={(category && { backgroundColor: category.color }) || undefined}
      >
        {title}
      </span>
      <p>{content}</p>
      <button data-testid="deleteButton" onClick={onDelete}>
        X
      </button>
    </div>
  );
}

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
      {renderProvided(id, title, content, onDelete, category)}
    </Draggable>
  );
}
