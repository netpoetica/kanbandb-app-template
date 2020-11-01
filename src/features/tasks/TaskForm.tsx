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

export function createState(stateFn: typeof useState): State {
  const [text, setText] = stateFn("");
  const [category, setCategory] = stateFn<CategoryOption>(
    defaultCategoryColors[0]
  );
  return {
    text: {
      value: text,
      fn: setText,
    },
    category: {
      value: category,
      fn: setCategory,
    },
  };
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
  const state = createState(useState);
  const dispatch = useDispatch();
  return (
    <AddForm
      onSubmit={onSubmit(
        state.text.value,
        state.category.value.label,
        dispatch,
        saveTask,
        state.text.fn
      )}
      text={state.text.value}
      category={state.category.value.label}
      onCategoryChange={state.category.fn}
      onTextChange={state.text.fn}
    />
  );
}
