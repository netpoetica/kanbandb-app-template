import React from "react";
import { render, fireEvent } from "@testing-library/react";

import AddForm from "./AddForm";

describe("AddForm", () => {
  it("should have text input and a button", () => {
    const { getByTestId } = render(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <AddForm onSubmit={(): void => {}} />
    );
    const textInput = getByTestId("textInput");
    const button = getByTestId("submitButton");
    expect(textInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("should execute onSubmit upon press of the button and passed with value from input", () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const mockCallback = jest.fn((content): void => {});
    const { getByTestId } = render(<AddForm onSubmit={mockCallback} />);
    fireEvent.change(getByTestId("textInput"), { target: { value: "input" } });
    fireEvent(
      getByTestId("submitButton"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(mockCallback).toHaveBeenCalledWith("input");
  });
});
