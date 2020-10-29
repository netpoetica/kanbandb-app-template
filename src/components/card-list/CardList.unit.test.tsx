import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { render } from "@testing-library/react";

import { tasks } from "../../testData";
import CardList from "./CardList";

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
});
