import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import tasksReducer from "./features/tasks/tasksSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});

export const createNewStore = (): typeof store => {
  return configureStore({
    reducer: {
      tasks: tasksReducer,
    },
  });
};

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
