import React from "react";
import { render } from "@testing-library/react";

import TaskBoard from "./TaskBoard";
import { Board, Task } from "../../types";

describe("TaskBoard", () => {
  it("should display CardList and a title", () => {
    const tasks: Task[] = [
      {
        content: "test1",
        id: "id-test1",
      },
      {
        content: "test2",
        id: "id-test2",
      },
    ];
    const boards: Board[] = [
      {
        id: "testId1",
        label: "Label 1",
        tasks: tasks,
      },
      {
        id: "testId2",
        label: "Label 2",
        tasks: tasks,
      },
    ];
    const { queryAllByTestId } = render(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <TaskBoard boards={boards} onDragEnd={(): void => {}} />
    );
    const elements = queryAllByTestId("board");
    expect(elements.length).toBe(boards.length);
  });
});
