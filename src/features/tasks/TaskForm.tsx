import React, { useState, Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";

import { saveTask } from "./tasksSlice";
import { AddForm } from "../../components";
import { CategoryOption, Category } from "../../types";
import { defaultCategoryColors } from "../../config";

export type State = {
  text: {
    value: string;
    fn: Dispatch<SetStateAction<string>>;
  };
  category: {
    value: CategoryOption;
    fn: Dispatch<SetStateAction<CategoryOption>>;
  };
};

export type DispatchType = (payload: ReturnType<typeof saveTask>) => void;

export function createState(
  stateFn: typeof useState
): [
  string,
  Dispatch<SetStateAction<string>>,
  CategoryOption,
  Dispatch<SetStateAction<CategoryOption>>
] {
  return [...stateFn(""), ...stateFn<CategoryOption>(defaultCategoryColors[0])];
}

export function onSubmit(
  text: string,
  label: Category,
  dispatch: DispatchType,
  saveFn: typeof saveTask,
  setText: Dispatch<SetStateAction<string>>
) {
  return (): void => {
    dispatch(
      saveFn({
        content: text,
        name: label,
      })
    );
    setText("");
  };
}

export default function TaskFrom(): React.ReactElement {
  const [text, setText, category, setCategory] = createState(useState);
  const dispatch = useDispatch();
  return (
    <AddForm
      onSubmit={onSubmit(text, category.label, dispatch, saveTask, setText)}
      text={text}
      category={category.label}
      onCategoryChange={setCategory}
      onTextChange={setText}
    />
  );
}
