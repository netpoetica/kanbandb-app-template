import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Card from "./Card";

describe("Card", () => {
  const baseComponent = (component: React.ReactElement): React.ReactElement => (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <DragDropContext onDragEnd={(): void => {}}>
      <Droppable droppableId="test">
        {(provided): React.ReactElement => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {component}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
  it("should render a content from props", () => {
    const { getByText } = render(
      baseComponent(
        <Card
          id="test"
          title="bug"
          content="content"
          index={1}
          onDelete={jest.fn()}
        />
      )
    );
    const element = getByText("content");
    expect(element).toBeInTheDocument();
  });

  it("should render a delete button", () => {
    const { getByTestId } = render(
      baseComponent(
        <Card
          title="bug"
          id="test"
          content="content"
          index={1}
          onDelete={jest.fn()}
        />
      )
    );
    const element = getByTestId("deleteButton");
    expect(element).toBeInTheDocument();
  });

  it("should fire a callback upon pressing the delete button", () => {
    const onDelete = jest.fn();
    const { getByTestId } = render(
      baseComponent(
        <Card
          title="bug"
          id="test"
          content="content"
          index={1}
          onDelete={onDelete}
        />
      )
    );
    const element = getByTestId("deleteButton");
    fireEvent.click(element);
    expect(onDelete).toHaveBeenCalled();
  });
});
