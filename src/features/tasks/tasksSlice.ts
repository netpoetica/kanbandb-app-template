import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Task, Board } from "../../types";
import { AppThunk, RootState } from "../../store";

export type BoardDestination = {
  index: number;
  id: Board["id"];
};

export type TasksState = {
  records: {
    [key in Board["id"]]: Omit<Board, "id">;
  };
};

export type TaskChangeStatusPayload = {
  id: Task["id"];
  boardId: Board["id"];
  status: Task["status"];
};

export type BoardChangeTasksPayload = {
  id: Board["id"];
  tasks: Task[];
};

export type TaskMoveToSameBoardPayload = {
  id: Board["id"];
  sourceIndex: number;
  destinationIndex: number;
};

export type TaskMoveToAnotherBoardPayload = {
  source: BoardDestination;
  destination: BoardDestination;
};

export const initialState: TasksState = {
  records: {
    TODO: {
      label: "To-do",
      tasks: [],
    },
    DOING: {
      label: "In progress",
      tasks: [],
    },
    DONE: {
      label: "Done",
      tasks: [],
    },
  },
};

function reorderTasks(
  list: Task[],
  startIndex: number,
  endIndex: number
): Task[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function moveTask(
  sourceTasks: Task[],
  destinationTasks: Task[],
  sourceBoard: BoardDestination,
  destinationBoard: BoardDestination
): Task[][] {
  const sourceClone = Array.from(sourceTasks);
  const destClone = Array.from(destinationTasks);
  const [removed] = sourceClone.splice(sourceBoard.index, 1);
  removed.status = destinationBoard.id;
  destClone.splice(destinationBoard.index, 0, removed);

  return [sourceClone, destClone];
}

function collectBoards(records: TasksState["records"]): Board[] {
  const boards: Board[] = [];
  for (const key in records) {
    const boardId = key as Board["id"];
    const board = records[boardId];
    if (board) {
      boards.push({
        id: boardId,
        label: board.label,
        tasks: board.tasks,
      });
    }
  }
  return boards;
}

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    addTask: (state, action: PayloadAction<Task>): void => {
      const { records } = state;
      const { payload } = action;
      const board = records[payload.status];
      if (board) {
        board.tasks = [...board.tasks, payload];
      }
    },
    removeTask: (state, action: PayloadAction<Task>): void => {
      const { records } = state;
      const { payload } = action;
      const board = records[payload.status];
      if (board) {
        for (let x = 0; x < board.tasks.length; x++) {
          const task = board.tasks[x];
          if (task.id === payload.id) {
            board.tasks.splice(x, 1);
            break;
          }
        }
      }
    },
    moveTaskToSameBoard: (
      state,
      action: PayloadAction<TaskMoveToSameBoardPayload>
    ): void => {
      const { id, sourceIndex, destinationIndex } = action.payload;
      const board = state.records[id];
      if (board) {
        board.tasks = reorderTasks(board.tasks, sourceIndex, destinationIndex);
      }
    },
    moveTaskToAnotherBoard: (
      state,
      action: PayloadAction<TaskMoveToAnotherBoardPayload>
    ): void => {
      const { source, destination } = action.payload;
      const sourceBoard = state.records[source.id];
      const destinationBoard = state.records[destination.id];
      if (sourceBoard && destinationBoard) {
        const [sourceTasks, destinationTasks] = moveTask(
          sourceBoard.tasks,
          destinationBoard.tasks,
          {
            index: source.index,
            id: source.id,
          },
          {
            index: destination.index,
            id: destination.id,
          }
        );
        sourceBoard.tasks = sourceTasks;
        destinationBoard.tasks = destinationTasks;
      }
    },
    hydrate: (state, action: PayloadAction<Task[]>): void => {
      const tasks = action.payload;
      const records = state.records;
      for (const task of tasks) {
        if (records[task.status]) {
          records[task.status].tasks.push(task);
        }
      }
    },
    changeTaskStatus: (
      state,
      action: PayloadAction<TaskChangeStatusPayload>
    ): void => {
      const { id, status, boardId } = action.payload;
      const board = state.records[boardId];
      if (board) {
        const task = board.tasks.find((x) => x.id === id);
        if (task) {
          task.status = status;
        }
      }
    },
  },
});

export const {
  moveTaskToAnotherBoard,
  moveTaskToSameBoard,
  addTask,
  removeTask,
  hydrate,
  changeTaskStatus,
} = tasksSlice.actions;

export const fetchTasks = (): AppThunk => async (dispatch): Promise<void> => {
  // const response = await WeekDataService.fetchCampaigns();
  // dispatch(hydrate(response));
};

export const selectBoards = (state: RootState): Board[] => {
  const { records } = state.tasks;
  return collectBoards(records);
};

export default tasksSlice.reducer;
