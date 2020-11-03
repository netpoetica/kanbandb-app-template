import React, { useState } from "react";
import { render } from "@testing-library/react";
import { Droppable, DragDropContext } from "react-beautiful-dnd";
import { Provider } from "react-redux";

import { createNewStore } from "../../store";

import TaskCard, {
  onDelete,
  onEditChanged,
  onUpdate,
  changeEdit,
  createState,
} from "./TaskCard";
import { tasks } from "../../testData";

describe("features/TaskForm", () => {
  it("should properly dispatch an action on delete", () => {
    const task = tasks[0];
    const deleteFn = jest.fn();
    deleteFn.mockReturnValue(task.id);
    const dispatch = jest.fn();
    const method = onDelete(task, deleteFn, dispatch);
    method();
    expect(dispatch).toBeCalledWith(task.id);
    expect(deleteFn).toBeCalledWith(task);
  });

  it("should properly dispatch an action on update", () => {
    const task = tasks[0];
    const updateFn = jest.fn();
    updateFn.mockReturnValue(task.id);
    const setIsEdit = jest.fn();
    const dispatch = jest.fn();
    const method = onUpdate(
      task.id,
      task.name,
      task.content,
      updateFn,
      setIsEdit,
      dispatch
    );
    method();
    expect(dispatch).toBeCalledWith(task.id);
    expect(updateFn).toBeCalledWith({
      id: task.id,
      name: task.name,
      content: task.content,
    });
    expect(setIsEdit).toBeCalledWith(false);
  });

  it("should handle local state change", () => {
    const task = tasks[0];
    const setContent = jest.fn();
    const setTitle = jest.fn();
    const method = onEditChanged(task, false, setContent, setTitle);
    method();
    expect(setTitle).toBeCalledWith(task.name);
    expect(setContent).toBeCalledWith(task.content);
    setContent.mockReset();
    setTitle.mockReset();
    const methodTrue = onEditChanged(task, true, setContent, setTitle);
    methodTrue();
    expect(setTitle).not.toHaveBeenCalled();
    expect(setContent).not.toHaveBeenCalled();
  });

  it("should handle mode change", () => {
    const setIsEdit = jest.fn();
    const method = changeEdit(setIsEdit, false);
    method();
    expect(setIsEdit).toHaveBeenCalledWith(false);
  });
  it("should create state", () => {
    const task = tasks[0];
    const stateFn = jest.fn();
    stateFn.mockReturnValue([1, 2]);
    const state = createState(
      task.content,
      task.name,
      false,
      stateFn as typeof useState
    );
    expect(stateFn).toHaveBeenCalledTimes(3);
    expect(state.length).toBe(6);
  });
  it("should render card", () => {
    const task = tasks[0];
    const store = createNewStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <DragDropContext onDragEnd={jest.fn()}>
          <Droppable droppableId="test">
            {(provided): React.ReactElement => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <TaskCard task={task} index={0} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Provider>
    );
    const card = getByTestId("card");
    expect(card).toBeInTheDocument();
    expect(card.dataset.cardId).toBe(task.id);
  });
});
