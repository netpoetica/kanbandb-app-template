import React from "react";
import { render, fireEvent, cleanup, within } from "@testing-library/react";
import { Provider } from "react-redux";
import {
  mockGetComputedSpacing,
  mockDndElSpacing,
  makeDnd,
  DND_DRAGGABLE_DATA_ATTR,
  DND_DIRECTION_DOWN,
} from "react-beautiful-dnd-test-utils";

import { createNewStore } from "./store";
import { loadDataForTest } from "./testUtils";
import service from "./services/TaskService";
import App from "./App";

service.entityName = "test-tasks";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderApp = async (): Promise<any> => {
  const store = createNewStore();
  const rtlUtils = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  mockDndElSpacing(rtlUtils);

  const makeGetDragEl = (id: string) => (): HTMLElement | undefined => {
    const cards = rtlUtils.getAllByTestId("card");
    const card = cards.find((x) => x.dataset.cardId === id);
    if (card) {
      return card.closest(DND_DRAGGABLE_DATA_ATTR);
    }
  };
  return { makeGetDragEl, ...rtlUtils, store };
};

describe("App", () => {
  beforeEach(() => {
    mockGetComputedSpacing();
    cleanup();
    localStorage.clear();
  });
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });
  it("should load data from db", async () => {
    await loadDataForTest();
    const { findAllByTestId } = await renderApp();
    const tasks = await service.fetchAll();
    const cards = await findAllByTestId("card");
    tasks.forEach((task) => {
      const card = cards.find((x) => x.dataset.cardId === task.id);
      expect(card).toBeDefined();
    });
    expect(cards.length).toBe(tasks.length);
  });
  it("should display properly even if there are no records in db", async () => {
    const { getByTestId, findAllByTestId } = await renderApp();
    const tasks = await service.fetchAll();
    expect(tasks.length).toBe(0);

    const addForm = getByTestId("addForm");
    const boards = await findAllByTestId("board");
    expect(boards.length).toBe(3);
    expect(addForm).toBeInTheDocument();
    const cardLists = await findAllByTestId("cardList");
    expect(cardLists.length).toBe(3);
  });
  it("should delete a task", async () => {
    await loadDataForTest();
    const tasks = await service.fetchAll();
    const task = tasks[2];
    const { findAllByTestId } = await renderApp();
    const deleteButtons = await findAllByTestId("deleteButton");
    deleteButtons.forEach((btn) => {
      if (btn.parentElement?.dataset.cardId === task.id) {
        fireEvent.click(btn);
      }
    });
    const newTasks = await service.fetchAll();
    const find = newTasks.find((x) => x.id === task.id);
    expect(find).not.toBeDefined();
  });
  it("should add a task", async () => {
    const { getByTestId, findAllByTestId } = await renderApp();
    const testContent = "content";
    const form = getByTestId("addForm");
    const textInput = getByTestId("textInput");
    const categorySelect = getByTestId("categorySelect") as HTMLSelectElement;

    fireEvent.change(textInput, { target: { value: testContent } });
    fireEvent.submit(form);
    const cards = await findAllByTestId("card");
    const tasks = await service.fetchAll();

    expect(tasks[0].content).toBe(testContent);

    expect(tasks.length).toBe(cards.length);
    cards.forEach((card: HTMLElement, index: number) => {
      expect(card).toHaveTextContent(categorySelect.value);
      expect(card).toHaveTextContent(tasks[index].content);
      expect(card.dataset.cardId).toBe(tasks[index].id);
    });

    const cardLists = await findAllByTestId("cardList");
    expect(cardLists.length).toBe(3);
  });
  it("should should move a task to the same board", async () => {
    await loadDataForTest();
    const tasks = await service.fetchAll();
    const { getByText, makeGetDragEl, findAllByTestId } = await renderApp();
    const todoTasks = tasks.filter((x) => x.status === "TODO");
    const cardLists = await findAllByTestId("cardList");
    const todoList = cardLists.find((x) => x.dataset.rbdDroppableId === "TODO");
    if (todoList) {
      const cards = await within(todoList).findAllByTestId("card");
      expect(cards.length).toBe(todoTasks.length);
      const card = cards[0];
      const currentOrder = cards.map((x) => x.dataset.cardId);
      await makeDnd({
        getByText,
        getDragEl: makeGetDragEl(card.dataset.cardId as string),
        direction: DND_DIRECTION_DOWN,
        positions: 2,
      });
      const reorderedCards = await within(todoList).findAllByTestId("card");
      const newOrder = reorderedCards.map((x) => x.dataset.cardId);
      expect(newOrder).not.toEqual(currentOrder);
      const reorderedTasks = (await service.fetchAll())
        .filter((x) => x.status === "TODO")
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .sort((a, b) => a.priority! - b.priority!)
        .map((x) => x.id);
      expect(newOrder).toEqual(reorderedTasks);
    }
  });
});
