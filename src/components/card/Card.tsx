import React from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";

import styles from "./Card.module.scss";
import { ReactComponent as EditIcon } from "./editIcon.svg";
import { ReactComponent as DoneIcon } from "./doneIcon.svg";
import { Category, CategoryOption } from "../../types";
import { defaultCategoryColors } from "../../config";
import { CategorySelect } from "../index";

export type CardMode = "view" | "edit";

export type Props = {
  id: string;
  content: string;
  index: number;
  title: Category;
  mode: CardMode;
  onDelete: () => void;
  onUpdate: () => void;
  onTextChange: (text: string) => void;
  onCategoryChange: (category: Category) => void;
  onCancelUpdate: () => void;
  onEdit: () => void;
};
export function onCardTextChange(onChange: Props["onTextChange"]) {
  return (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };
}

export function onCardCategoryChange(onChange: Props["onCategoryChange"]) {
  return (option: CategoryOption): void => {
    onChange(option.label);
  };
}

export function renderView(
  title: Props["title"],
  content: Props["content"],
  onEdit: Props["onEdit"],
  category?: CategoryOption
): React.ReactElement {
  return (
    <>
      <span
        data-testid="category"
        style={(category && { backgroundColor: category.color }) || undefined}
      >
        {title}
      </span>
      <p data-testid="content">{content} </p>
      <button data-testid="editButton" className="editBtn" onClick={onEdit}>
        Edit <EditIcon />
      </button>
    </>
  );
}
export function renderEdit(
  id: Props["id"],
  title: Props["title"],
  content: Props["content"],
  onTextChange: Props["onTextChange"],
  onCategoryChange: Props["onCategoryChange"],
  onUpdate: Props["onUpdate"],
  onCancelUpdate: Props["onCancelUpdate"]
): React.ReactElement {
  return (
    <>
      <CategorySelect
        onChange={onCardCategoryChange(onCategoryChange)}
        value={title}
      />
      <input
        data-testid="inputText"
        type="text"
        value={content}
        onChange={onCardTextChange(onTextChange)}
      />
      <div data-testid="editButtonGroup" className="editButtonGroup">
        <button data-testid="confirmCancelButton" onClick={onCancelUpdate}>
          Cancel
        </button>
        <button data-testid="confirmUpdateButton" onClick={onUpdate}>
          Save <DoneIcon />
        </button>
      </div>
    </>
  );
}

export function renderProvided(
  id: Props["id"],
  title: Props["title"],
  content: Props["content"],
  mode: Props["mode"],
  onDelete: Props["onDelete"],
  onUpdate: Props["onUpdate"],
  onTextChange: Props["onTextChange"],
  onCategoryChange: Props["onCategoryChange"],
  onCancelUpdate: Props["onCancelUpdate"],
  onEdit: Props["onEdit"],
  category?: CategoryOption
) {
  return (provided: DraggableProvided): React.ReactElement => (
    <div
      data-testid="card"
      data-card-id={id}
      className={mode === "view" ? styles.cardView : styles.cardEdit}
      ref={provided.innerRef}
      {...provided.dragHandleProps}
      {...provided.draggableProps}
    >
      {mode === "view"
        ? renderView(title, content, onEdit, category)
        : renderEdit(
            id,
            title,
            content,
            onTextChange,
            onCategoryChange,
            onUpdate,
            onCancelUpdate
          )}
      <button
        className="deleteBtn"
        data-testid="deleteButton"
        onClick={onDelete}
      >
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
  onUpdate,
  onTextChange,
  onCategoryChange,
  onCancelUpdate,
  onEdit,
  mode,
}: Props): React.ReactElement {
  const category = defaultCategoryColors.find((x) => x.label === title);
  return (
    <Draggable draggableId={id} index={index}>
      {renderProvided(
        id,
        title,
        content,
        mode,
        onDelete,
        onUpdate,
        onTextChange,
        onCategoryChange,
        onCancelUpdate,
        onEdit,
        category
      )}
    </Draggable>
  );
}

Card.defaultProps = {
  mode: "edit",
};
