import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { DropResult } from "react-beautiful-dnd";
import { Dispatch } from "@reduxjs/toolkit";

import Tasks, { onDragEnd } from "./Tasks";

import { moveTaskToAnotherBoard, moveTaskToSameBoard } from "./tasksSlice";
import { store } from "../../store";

describe("features/Tasks", () => {
  it("should display a task board component", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Tasks />
      </Provider>
    );
    expect(getByTestId("taskBoard")).toBeInTheDocument();
  });
  it("should dispatch an action for moving a task within the same board", () => {
    const dispatch: Dispatch = jest.fn() as Dispatch;
    const droppedToSameBoard: DropResult = {
      source: {
        droppableId: "TODO",
        index: 0,
      },
      destination: {
        droppableId: "TODO",
        index: 1,
      },
    } as DropResult;
    onDragEnd(droppedToSameBoard, dispatch);
    expect(dispatch).toBeCalledWith(
      moveTaskToSameBoard({
        id: "TODO",
        sourceIndex: 0,
        destinationIndex: 1,
      })
    );
  });
  it("should dispatch an action for moving a task to another board", () => {
    const dispatch: Dispatch = jest.fn() as Dispatch;
    const droppedToAnotherBoard: DropResult = {
      source: {
        droppableId: "TODO",
        index: 0,
      },
      destination: {
        droppableId: "DOING",
        index: 1,
      },
    } as DropResult;
    onDragEnd(droppedToAnotherBoard, dispatch);
    expect(dispatch).toBeCalledWith(
      moveTaskToAnotherBoard({
        source: {
          id: "TODO",
          index: 0,
        },
        destination: {
          id: "DOING",
          index: 1,
        },
      })
    );
  });
  it("should not dispatch an action for moving a task area that is not droppable", () => {
    const dispatch: Dispatch = jest.fn() as Dispatch;
    const droppedToAnotherBoard: DropResult = {
      source: {
        droppableId: "TODO",
        index: 0,
      },
    } as DropResult;
    onDragEnd(droppedToAnotherBoard, dispatch);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
