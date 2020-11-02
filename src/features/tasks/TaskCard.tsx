import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Task } from "../../types";
import { Card } from "../../components";
import { deleteTask, updateTaskDetails } from "./tasksSlice";

export type Props = {
  task: Task;
  index: number;
};

export type DispatchType = (payload: ReturnType<typeof deleteTask>) => void;

export function onDelete(
  task: Task,
  deleteFn: typeof deleteTask,
  dispatch: DispatchType
) {
  return (): void => dispatch(deleteFn(task));
}

export function onUpdate(
  id: Props["task"]["id"],
  name: Props["task"]["name"],
  content: Props["task"]["content"],
  updateFn: typeof updateTaskDetails,
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: DispatchType
) {
  return (): void => {
    dispatch(updateFn({ id, name, content }));
    setIsEdit(false);
  };
}

export default function TaskCard({ task, index }: Props): React.ReactElement {
  const [content, setContent] = useState(task.content);
  const [title, setTitle] = useState(task.name);
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isEdit === false) {
      setContent(task.content);
      setTitle(task.name);
    }
  }, [isEdit, task.content, task.name]);
  return (
    <Card
      id={task.id}
      title={title}
      content={content}
      index={index}
      onDelete={onDelete(task, deleteTask, dispatch)}
      onUpdate={onUpdate(
        task.id,
        title,
        content,
        updateTaskDetails,
        setIsEdit,
        dispatch
      )}
      onTextChange={setContent}
      onCategoryChange={setTitle}
      onCancelUpdate={(): void => setIsEdit(false)}
      onEdit={(): void => setIsEdit(true)}
      mode={isEdit ? "edit" : "view"}
    />
  );
}
