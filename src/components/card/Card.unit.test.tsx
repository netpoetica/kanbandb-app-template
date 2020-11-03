import React from "react";
import { fireEvent, render, cleanup } from "@testing-library/react";
import {
  DragDropContext,
  DraggableProvided,
  Droppable,
} from "react-beautiful-dnd";

import Card, {
  onCardCategoryChange,
  renderProvided,
  onCardTextChange,
  renderView,
  renderEdit,
} from "./Card";
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
          onCancelUpdate={jest.fn()}
          onCategoryChange={jest.fn()}
          onEdit={jest.fn()}
          onTextChange={jest.fn()}
          onUpdate={jest.fn()}
          mode="view"
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
          onCancelUpdate={jest.fn()}
          onCategoryChange={jest.fn()}
          onEdit={jest.fn()}
          onTextChange={jest.fn()}
          onUpdate={jest.fn()}
          mode="view"
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
          onCancelUpdate={jest.fn()}
          onCategoryChange={jest.fn()}
          onEdit={jest.fn()}
          onTextChange={jest.fn()}
          onUpdate={jest.fn()}
          mode="view"
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
          onCancelUpdate={jest.fn()}
          onCategoryChange={jest.fn()}
          onEdit={jest.fn()}
          onTextChange={jest.fn()}
          onUpdate={jest.fn()}
          mode="view"
        />
      )
    );
    const element = getByTestId("deleteButton");
    fireEvent.click(element);
    expect(onDelete).toHaveBeenCalled();
  });

  it("should render provided", () => {
    const method = renderProvided(
      "test",
      "bug",
      "content",
      "view",
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
      defaultCategoryColors[0]
    );
    const { getByTestId } = render(method({} as DraggableProvided));
    const card = getByTestId("card");
    expect(card).toBeInTheDocument();
    expect(card.dataset.cardId).toBe("test");
  });

  it("should handle on card text change", () => {
    const onChange = jest.fn();
    const method = onCardTextChange(onChange);
    method({
      target: {
        value: "test",
      },
    } as React.ChangeEvent<HTMLInputElement>);
    expect(onChange).toHaveBeenCalledWith("test");
  });

  it("should handle on card category change", () => {
    const onChange = jest.fn();
    const method = onCardCategoryChange(onChange);
    method(defaultCategoryColors[0]);
    expect(onChange).toHaveBeenCalledWith(defaultCategoryColors[0].label);
  });

  it("should render view mode", () => {
    const { getByTestId } = render(renderView("test", "test", jest.fn()));
    const category = getByTestId("category");
    const content = getByTestId("content");
    const editButton = getByTestId("editButton");
    expect(category).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
  });

  it("should render edit mode", () => {
    const { getByTestId } = render(
      renderEdit(
        "test",
        "bug",
        "test",
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn()
      )
    );
    const categorySelect = getByTestId("categorySelect");
    const inputText = getByTestId("inputText");
    const editButtonGroup = getByTestId("editButtonGroup");
    expect(categorySelect).toBeInTheDocument();
    expect(inputText).toBeInTheDocument();
    expect(editButtonGroup).toBeInTheDocument();
  });

  it("should handle on submit of detail change", () => {
    const onUpdate = jest.fn();
    const { getByTestId } = render(
      baseComponent(
        <Card
          title="bug"
          id="test"
          content="content"
          index={1}
          onDelete={jest.fn()}
          onCancelUpdate={jest.fn()}
          onCategoryChange={jest.fn()}
          onEdit={jest.fn()}
          onTextChange={jest.fn()}
          onUpdate={onUpdate}
          mode="edit"
        />
      )
    );
    const confirmButton = getByTestId("confirmUpdateButton");
    fireEvent.click(confirmButton);
    expect(onUpdate).toHaveBeenCalled();
  });

  it("should handle on cancel of detail change", () => {
    const onCancel = jest.fn();
    const { getByTestId } = render(
      baseComponent(
        <Card
          title="bug"
          id="test"
          content="content"
          index={1}
          onDelete={jest.fn()}
          onCancelUpdate={onCancel}
          onCategoryChange={jest.fn()}
          onEdit={jest.fn()}
          onTextChange={jest.fn()}
          onUpdate={jest.fn()}
          mode="edit"
        />
      )
    );
    const cancelButton = getByTestId("confirmCancelButton");
    fireEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalled();
  });
});
