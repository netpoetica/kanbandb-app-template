import React from "react";
import { render } from "@testing-library/react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Card from "./Card";

describe("Card", () => {
  it("should render a content from props", () => {
    const { getByText } = render(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <DragDropContext onDragEnd={(): void => {}}>
        <Droppable droppableId="test">
          {(provided): React.ReactElement => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <Card id="test" content="content" index={1} />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
    const element = getByText("content");
    expect(element).toBeInTheDocument();
  });
});
