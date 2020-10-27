import React, { useState } from "react";

import styles from "./AddForm.module.scss";

export type Props = {
  onSubmit: (text: string) => void;
};

export default function AddForm({ onSubmit }: Props): React.ReactElement {
  const [value, setValue] = useState("");
  function handleClick(): void {
    onSubmit(value);
    setValue("");
  }
  return (
    <div className={styles.addForm}>
      <input
        data-testid="textInput"
        type="text"
        placeholder="e.g. Bug: TextPoll not dispatching half stars"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setValue(e.target.value)
        }
      ></input>
      <button
        data-testid="submitButton"
        disabled={value.length <= 0}
        onClick={(): void => handleClick()}
      >
        Add new
      </button>
    </div>
  );
}
