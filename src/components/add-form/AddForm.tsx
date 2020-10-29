import React, { useState } from "react";

import styles from "./AddForm.module.scss";
import { CategorySelect } from "../../components";
import { defaultCategoryColors } from "../../config";
import { Category } from "../../types";

export type Props = {
  onSubmit: (text: string, category: Category) => void;
};

export default function AddForm({ onSubmit }: Props): React.ReactElement {
  const [value, setValue] = useState("");
  const [category, setCategory] = useState(defaultCategoryColors[0].label);
  function handleClick(): void {
    onSubmit(value, category);
    setValue("");
  }
  return (
    <form
      data-testid="addForm"
      className={styles.addForm}
      onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        handleClick();
      }}
    >
      <div>
        <input
          data-testid="textInput"
          type="text"
          placeholder="e.g. Bug: TextPoll not dispatching half stars"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setValue(e.target.value)
          }
        />
        <CategorySelect
          value={category}
          onChange={(option): void => setCategory(option.label)}
        />
      </div>
      <button
        type="submit"
        data-testid="submitButton"
        disabled={value.length <= 0}
      >
        Add new
      </button>
    </form>
  );
}
