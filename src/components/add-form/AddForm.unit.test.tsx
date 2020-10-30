import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { defaultCategoryColors } from "../../config";
import AddForm from "./AddForm";

describe("components/AddForm", () => {
  it("should have a form, text input, select and a button", () => {
    const { getByTestId } = render(<AddForm onSubmit={jest.fn()} />);
    const textInput = getByTestId("textInput");
    const button = getByTestId("submitButton");
    const addForm = getByTestId("addForm");
    const categorySelect = getByTestId("categorySelect");
    expect(addForm).toBeInTheDocument();
    expect(textInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(categorySelect).toBeInTheDocument();
  });

  it("should execute onSubmit upon press of the button and passed with value from input", () => {
    const mockCallback = jest.fn();
    const { getByTestId } = render(<AddForm onSubmit={mockCallback} />);
    const textInput = getByTestId("textInput");
    fireEvent.change(textInput, { target: { value: "input" } });
    fireEvent.submit(getByTestId("addForm"));
    expect(mockCallback).toHaveBeenCalledWith(
      "input",
      defaultCategoryColors[0].label
    );
  });
});
