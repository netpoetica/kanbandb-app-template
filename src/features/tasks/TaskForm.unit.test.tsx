import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

import { defaultCategoryColors } from "../../config";
import TaskForm, { createState, onSubmit } from "./TaskForm";
import { createNewStore } from "../../store";

describe("features/TaskForm", () => {
  it("should render task form", () => {
    const store = createNewStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <TaskForm />
      </Provider>
    );
    const addForm = getByTestId("addForm");
    expect(addForm).toBeInTheDocument();
  });
  it("should create state", () => {
    const stateFn = jest.fn();
    stateFn.mockReturnValue(["test", jest.fn()]);
    createState(stateFn);
    expect(stateFn.mock.calls[0][0]).toBe("");
    expect(stateFn.mock.calls[1][0]).toEqual(defaultCategoryColors[0]);
  });

  it("should properly handle submit", () => {
    const dispatch = jest.fn();
    const saveFn = jest.fn();
    saveFn.mockReturnValue("test");
    const setText = jest.fn();
    const method = onSubmit(
      "testContent",
      defaultCategoryColors[0].label,
      dispatch,
      saveFn,
      setText
    );
    method();
    expect(dispatch).toHaveBeenCalledWith("test");
    expect(saveFn).toHaveBeenCalledWith({
      content: "testContent",
      name: defaultCategoryColors[0].label,
    });
    expect(setText).toHaveBeenCalledWith("");
  });
});
