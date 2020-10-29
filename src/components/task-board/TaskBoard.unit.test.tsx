import React from "react";
import { render } from "@testing-library/react";

import { completeBoards } from "../../testData";
import TaskBoard from "./TaskBoard";

describe("components/TaskBoard", () => {
  it("should invoke render children function passing the correct parameters", () => {
    const renderChildren = jest.fn();
    render(
      <TaskBoard boards={completeBoards} onDragEnd={jest.fn()}>
        {renderChildren}
      </TaskBoard>
    );
    renderChildren.mock.calls.forEach((call, index) => {
      expect(call[0]).toBe(completeBoards[index].id);
      expect(call[1]).toEqual(completeBoards[index].tasks);
    });
    expect(renderChildren).toHaveBeenCalledTimes(completeBoards.length);
  });
});
