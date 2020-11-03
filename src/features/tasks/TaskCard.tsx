import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";

import { Task, Category } from "../../types";
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

export function onEditChanged(
  task: Task,
  isEdit: boolean,
  setContent: Dispatch<SetStateAction<string>>,
  setTitle: Dispatch<SetStateAction<Category>>
) {
  return (): void => {
    if (isEdit === false) {
      setContent(task.content);
      setTitle(task.name);
    }
  };
}

export function changeEdit(
  setIsEdit: Dispatch<SetStateAction<boolean>>,
  value: boolean
) {
  return (): void => {
    setIsEdit(value);
  };
}

export function createState(
  content: Props["task"]["content"],
  name: Props["task"]["name"],
  edit: boolean,
  stateFn: typeof useState
): [
  string,
  Dispatch<SetStateAction<string>>,
  Category,
  Dispatch<SetStateAction<Category>>,
  boolean,
  Dispatch<SetStateAction<boolean>>
] {
  return [...stateFn(content), ...stateFn(name), ...stateFn(edit)];
}

export default function TaskCard({ task, index }: Props): React.ReactElement {
  const [content, setContent, title, setTitle, isEdit, setIsEdit] = createState(
    task.content,
    task.name,
    false,
    useState
  );
  const dispatch = useDispatch();
  useEffect(onEditChanged(task, isEdit, setContent, setTitle), [
    isEdit,
    task.content,
    task.name,
  ]);
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
      onCancelUpdate={changeEdit(setIsEdit, false)}
      onEdit={changeEdit(setIsEdit, true)}
      mode={isEdit ? "edit" : "view"}
    />
  );
}
