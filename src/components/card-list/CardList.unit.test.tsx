import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { render } from "@testing-library/react";

import CardList from "./CardList";
import { Task } from "../../types";

describe("CardList", () => {
  it("should display the cards with matching contents", () => {
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
    const { queryAllByTestId } = render(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <DragDropContext onDragEnd={(): void => {}}>
        <CardList id="test" tasks={tasks} />
      </DragDropContext>
    );
    const elements = queryAllByTestId("card");
    expect(elements.length).toBe(2);
    expect(elements[0]).toHaveTextContent("test1");
    expect(elements[1]).toHaveTextContent("test2");
  });
});
