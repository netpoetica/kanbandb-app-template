import React from "react";

import styles from "./AddForm.module.scss";
import { CategorySelect } from "../../components";
import { CategoryOption, Category } from "../../types";

export type Props = {
  onSubmit: () => void;
  onCategoryChange: (categoryOption: CategoryOption) => void;
  onTextChange: (text: string) => void;
  text: string;
  category: Category;
};

export function onFormSubmit(onSubmit: Props["onSubmit"]) {
  return (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit();
  };
}

export function onFormTextChange(onTextChange: Props["onTextChange"]) {
  return (e: React.ChangeEvent<HTMLInputElement>): void => {
    onTextChange(e.target.value);
  };
}

export default function AddForm({
  onSubmit,
  text,
  category,
  onCategoryChange,
  onTextChange,
}: Props): React.ReactElement {
  return (
    <form
      data-testid="addForm"
      className={styles.addForm}
      onSubmit={onFormSubmit(onSubmit)}
    >
      <div>
        <input
          data-testid="textInput"
          type="text"
          placeholder="e.g. Bug: TextPoll not dispatching half stars"
          value={text}
          onChange={onFormTextChange(onTextChange)}
        />
        <CategorySelect value={category} onChange={onCategoryChange} />
      </div>
      <button
        type="submit"
        data-testid="submitButton"
        disabled={text.length <= 0}
      >
        Add new
      </button>
    </form>
  );
}
