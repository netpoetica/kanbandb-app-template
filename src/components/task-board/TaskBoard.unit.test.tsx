import React from "react";
import { render } from "@testing-library/react";

import { completeBoards } from "../../testData";
import TaskBoard, { renderBoards } from "./TaskBoard";

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
  it("should iterate and render boards", () => {
    const renderChildren = jest.fn();
    const { getAllByTestId } = render(
      <>{renderBoards(completeBoards, renderChildren)}</>
    );
    const boards = getAllByTestId("board");
    boards.forEach((board, index): void => {
      expect(board).toHaveTextContent(completeBoards[index].label);
    });
  });
});
