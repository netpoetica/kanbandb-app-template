import React from "react";
import { Provider } from "react-redux";
import { render, cleanup } from "@testing-library/react";
import { DropResult, Droppable, DragDropContext } from "react-beautiful-dnd";

import { createNewStore } from "../../store";
import { inProgressTasks, todoTasks, doneTasks } from "../../testData";
import Tasks, {
  onDragEnd,
  renderCard,
  renderCardList,
  onDelete,
  fetchInitialData,
} from "./Tasks";
import TaskService from "../../services/TaskService";

jest.mock("../../services/TaskService");
const mockedService = TaskService as jest.Mocked<typeof TaskService>;

describe("features/Tasks", () => {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });
  it("should display a task board and all related child components based on data", async () => {
    mockedService.fetchAll.mockResolvedValue(
      Promise.resolve([...todoTasks, ...inProgressTasks, ...doneTasks])
    );
    const store = createNewStore();
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
    const dispatch = jest.fn();
    const method = onDragEnd(dispatch);
    method(droppedToSameBoard);
    expect(dispatch).toHaveBeenCalled();
  });
  it("should not dispatch an action for moving a task within the same board and the same destination", () => {
    const droppedToSameBoard: DropResult = {
      source: {
        droppableId: "TODO",
        index: 0,
      },
      destination: {
        droppableId: "TODO",
        index: 0,
      },
    } as DropResult;
    const dispatch = jest.fn();
    const method = onDragEnd(dispatch);
    method(droppedToSameBoard);
    expect(dispatch).not.toHaveBeenCalled();
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
    const dispatch = jest.fn();
    const method = onDragEnd(dispatch);
    method(droppedToAnotherBoard);
    expect(dispatch).toHaveBeenCalled();
  });
  it("should not dispatch an action for moving a task area that is not droppable", () => {
    const droppedToInvalidArea: DropResult = {
      source: {
        droppableId: "TODO",
        index: 0,
      },
    } as DropResult;
    const dispatch = jest.fn();
    const method = onDragEnd(dispatch);
    method(droppedToInvalidArea);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("should render card list", () => {
    const dispatch = jest.fn();
    const deleteFn = jest.fn();
    const renderChild = jest.fn();
    renderChild.mockReturnValue(jest.fn());
    const method = renderCardList(dispatch, renderChild, deleteFn);
    render(
      <DragDropContext onDragEnd={jest.fn()}>
        {method("TODO", todoTasks)}
      </DragDropContext>
    );
    expect(renderChild).toBeCalledWith(dispatch, deleteFn);
  });

  it("should render card", () => {
    const dispatch = jest.fn();
    const deleteFn = jest.fn();
    const method = renderCard(dispatch, deleteFn);
    const { getByTestId } = render(
      <DragDropContext onDragEnd={jest.fn()}>
        <Droppable droppableId="test">
          {(provided): React.ReactElement => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {method(todoTasks[0], 0)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
    const card = getByTestId("card");
    expect(card).toBeInTheDocument();
    expect(card.dataset.cardId).toBe(todoTasks[0].id);
  });

  it("should delete a card", () => {
    const dispatch = jest.fn();
    const deleteFn = jest.fn();
    deleteFn.mockReturnValue("test");
    const method = onDelete(todoTasks[0], deleteFn, dispatch);
    method();
    expect(deleteFn).toBeCalledWith(todoTasks[0]);
    expect(dispatch).toBeCalledWith("test");
  });

  it("should fetch initial data", () => {
    const dispatch = jest.fn();
    const fetchTasks = jest.fn();
    const method = fetchInitialData(dispatch, fetchTasks);
    method();
    expect(dispatch).toBeCalled();
    expect(fetchTasks).toBeCalled();
  });
});
