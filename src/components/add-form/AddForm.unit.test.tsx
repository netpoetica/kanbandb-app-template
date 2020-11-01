import React, { FormEvent } from "react";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";

import { defaultCategoryColors } from "../../config";
import AddForm, { onFormSubmit, onFormTextChange } from "./AddForm";

describe("components/AddForm", () => {
  beforeEach(() => {
    cleanup();
  });
  it("should have a form, text input, select and a button", () => {
    const { getByTestId } = render(
      <AddForm
        onSubmit={jest.fn()}
        category={defaultCategoryColors[0].label}
        text=""
        onCategoryChange={jest.fn()}
        onTextChange={jest.fn()}
      />
    );
    const textInput = getByTestId("textInput");
    const button = getByTestId("submitButton");
    const addForm = getByTestId("addForm");
    const categorySelect = getByTestId("categorySelect");
    expect(addForm).toBeInTheDocument();
    expect(textInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(categorySelect).toBeInTheDocument();
  });

  it("should execute onSubmit upon press of the button and passed with value from input", async () => {
    const submit = jest.fn();
    const { getByTestId } = render(
      <AddForm
        onSubmit={submit}
        category={defaultCategoryColors[0].label}
        text=""
        onCategoryChange={jest.fn()}
        onTextChange={jest.fn()}
      />
    );
    const textInput = getByTestId("textInput") as HTMLInputElement;
    fireEvent.change(textInput, { target: { value: "input" } });
    fireEvent.submit(getByTestId("addForm"));
    expect(submit).toHaveBeenCalled();
    await waitFor(() => {
      expect(textInput.value).toBe("");
    });
  });

  it("should  text change callback upon changing text input", async () => {
    const onTextChange = jest.fn();
    const { getByTestId } = render(
      <AddForm
        onSubmit={jest.fn()}
        category={defaultCategoryColors[0].label}
        text=""
        onCategoryChange={jest.fn()}
        onTextChange={onTextChange}
      />
    );
    const textInput = getByTestId("textInput") as HTMLInputElement;
    fireEvent.change(textInput, { target: { value: "input" } });
    expect(onTextChange).toHaveBeenCalledWith("input");
    await waitFor(() => {
      expect(textInput.value).toBe("");
    });
  });
  it("should properly handle form submit", () => {
    const submit = jest.fn();
    const method = onFormSubmit(submit);
    const fakeEvent = ({
      preventDefault: jest.fn(),
    } as unknown) as FormEvent<HTMLFormElement>;
    method(fakeEvent);
    expect(submit).toHaveBeenCalled();
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });

  it("should properly handle text change", () => {
    const change = jest.fn();
    const method = onFormTextChange(change);
    method({
      target: {
        value: "test",
      },
    } as React.ChangeEvent<HTMLInputElement>);
    expect(change).toHaveBeenCalledWith("test");
  });
});
