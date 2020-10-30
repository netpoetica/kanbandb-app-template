import configureStore from "redux-mock-store";
import { getDefaultMiddleware } from "@reduxjs/toolkit";
import { initialState } from "./features/tasks/tasksSlice";

const middlewares = getDefaultMiddleware();
export const mockStore = configureStore([...middlewares]);
export const store = mockStore({
  tasks: initialState,
});
