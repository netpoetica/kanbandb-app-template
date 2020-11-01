import React from "react";
import { DragDropContext, DroppableProvided } from "react-beautiful-dnd";
import { render } from "@testing-library/react";

import { tasks } from "../../testData";
import CardList, { renderProvided, renderTasks } from "./CardList";

describe("components/CardList", () => {
  it("should invoke render children function passing the correct parameters", () => {
    const renderChildren = jest.fn();
    render(
      <DragDropContext onDragEnd={jest.fn()}>
        <CardList id="test" tasks={tasks}>
          {renderChildren}
        </CardList>
      </DragDropContext>
    );
    renderChildren.mock.calls.forEach((call, index) => {
      expect(call[0]).toEqual(tasks[index]);
      expect(call[1]).toBe(index);
    });
    expect(renderChildren).toHaveBeenCalledTimes(tasks.length);
  });

  it("should render a card list", () => {
    const renderChildren = jest.fn();
    const method = renderProvided(tasks, renderChildren);
    const { getByTestId } = render(method({} as DroppableProvided));
    const cardList = getByTestId("cardList");
    expect(cardList).toBeInTheDocument();
  });

  it("should iterate tasks and execute a callback", () => {
    const renderChildren = jest.fn();
    renderTasks(tasks, renderChildren);
    tasks.forEach((task, index) => {
      expect(renderChildren).toHaveBeenCalledWith(task, index);
    });
    expect(renderChildren).toHaveBeenCalledTimes(tasks.length);
  });
});
