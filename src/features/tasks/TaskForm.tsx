import React from "react";
import { useDispatch } from "react-redux";

import { addTask } from "./tasksSlice";
import { AddForm } from "../../components";
import { Category } from "../../types";

export default function TaskFrom(): React.ReactElement {
  const dispatch = useDispatch();
  function onSubmit(text: string, name: Category): void {
    dispatch(
      addTask({
        id: `${Math.random()}`,
        content: text,
        status: "TODO",
        name: name,
      })
    );
  }
  return <AddForm onSubmit={onSubmit} />;
}
