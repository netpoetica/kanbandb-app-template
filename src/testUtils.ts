import configureStore from "redux-mock-store";
import { getDefaultMiddleware } from "@reduxjs/toolkit";
import { initialState } from "./features/tasks/tasksSlice";

import { tasks } from "./testData";

import service from "./services/TaskService";

const entityName = "test-tasks";

export const loadDataForTest = async (): Promise<void> => {
  service.entityName = entityName;
  await Promise.all(
    tasks.map((task) =>
      service.add({
        content: task.content,
        name: task.name,
      })
    )
  );
};

const middlewares = getDefaultMiddleware();
export const mockStore = configureStore([...middlewares]);
export const store = mockStore({
  tasks: initialState,
});
