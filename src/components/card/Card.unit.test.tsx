import React from "react";
import { fireEvent, render, cleanup } from "@testing-library/react";
import {
  DragDropContext,
  DraggableProvided,
  Droppable,
} from "react-beautiful-dnd";

import Card, { renderProvided } from "./Card";
import { defaultCategoryColors } from "../../config";

describe("components/Card", () => {
  beforeEach(() => {
    cleanup();
  });
  const baseComponent = (component: React.ReactElement): React.ReactElement => (
    <DragDropContext onDragEnd={jest.fn()}>
      <Droppable droppableId="test">
        {(provided): React.ReactElement => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {component}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  it("should render a card", () => {
    const { getByTestId } = render(
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
    const card = getByTestId("card");
    expect(card).toBeInTheDocument();
  });
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

  it("should render provided", () => {
    const onDelete = jest.fn();
    const method = renderProvided(
      "test",
      "bug",
      "content",
      onDelete,
      defaultCategoryColors[0]
    );
    const { getByTestId } = render(method({} as DraggableProvided));
    const card = getByTestId("card");
    expect(card).toBeInTheDocument();
    expect(card.dataset.cardId).toBe("test");
  });
});
