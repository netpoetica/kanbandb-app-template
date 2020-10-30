import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { DropResult } from "react-beautiful-dnd";

import { store } from "../../store";
import { inProgressTasks, todoTasks, doneTasks } from "../../testData";
import Tasks, { onDragEnd } from "./Tasks";
import TaskService from "../../services/TaskService";

jest.mock("../../services/TaskService");
const mockedService = TaskService as jest.Mocked<typeof TaskService>;

describe("features/Tasks", () => {
  it("should display a task board and all related child components based on data", async () => {
    mockedService.fetchAll.mockResolvedValue(
      Promise.resolve([...todoTasks, ...inProgressTasks, ...doneTasks])
    );
    const { findAllByTestId } = render(
      <Provider store={store}>
        <Tasks />
      </Provider>
    );
    const taskBoards = await findAllByTestId("taskBoard");
    const cardLists = await findAllByTestId("cardList");
    const cards = await findAllByTestId("card");
    expect(taskBoards.length).toBe(1);
    taskBoards.forEach((board) => {
      expect(board).toBeInTheDocument();
    });
    expect(cardLists.length).toBe(3);
    cardLists.forEach((cardList) => {
      expect(cardList).toBeInTheDocument();
    });
    expect(cards.length).toBe(
      todoTasks.length + inProgressTasks.length + doneTasks.length
    );
    cards.forEach((card) => {
      expect(card).toBeInTheDocument();
    });
  });
  it("should dispatch an action for moving a task within the same board", () => {
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
    const updateSameBoard = jest.fn();
    const updateMoveBoard = jest.fn();
    onDragEnd(droppedToSameBoard, updateSameBoard, updateMoveBoard);

    expect(updateSameBoard).toBeCalledWith({
      id: "TODO",
      sourceIndex: 0,
      destinationIndex: 1,
    });
    expect(updateMoveBoard).not.toHaveBeenCalled();
  });
  it("should dispatch an action for moving a task to another board", () => {
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
    const updateSameBoard = jest.fn();
    const updateMoveBoard = jest.fn();
    onDragEnd(droppedToAnotherBoard, updateSameBoard, updateMoveBoard);
    expect(updateMoveBoard).toBeCalledWith({
      source: {
        id: "TODO",
        index: 0,
      },
      destination: {
        id: "DOING",
        index: 1,
      },
    });
    expect(updateSameBoard).not.toHaveBeenCalled();
  });
  it("should not dispatch an action for moving a task area that is not droppable", () => {
    const droppedToAnotherBoard: DropResult = {
      source: {
        droppableId: "TODO",
        index: 0,
      },
    } as DropResult;
    const updateSameBoard = jest.fn();
    const updateMoveBoard = jest.fn();
    onDragEnd(droppedToAnotherBoard, updateSameBoard, updateMoveBoard);
    expect(updateSameBoard).not.toHaveBeenCalled();
    expect(updateMoveBoard).not.toHaveBeenCalled();
  });
});
