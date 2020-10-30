import React from "react";
import { useDispatch } from "react-redux";

import { saveTask } from "./tasksSlice";
import { AddForm } from "../../components";
import { Category } from "../../types";

export default function TaskFrom(): React.ReactElement {
  const dispatch = useDispatch();
  function onSubmit(text: string, name: Category): void {
    dispatch(
      saveTask({
        content: text,
        name: name,
      })
    );
  }
  return <AddForm onSubmit={onSubmit} />;
}
