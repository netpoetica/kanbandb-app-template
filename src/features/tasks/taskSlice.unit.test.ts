import reducer, {
  initialState,
  saveTask,
  deleteTask,
  fetchTasks,
  updateTaskToSameBoard,
  updateTaskToAnotherBoard,
  moveTaskToAnotherBoard,
  moveTaskToSameBoard,
  addTask,
  removeTask,
  hydrate,
  changeTaskStatus,
  selectBoards,
  TasksState,
  TaskMoveToAnotherBoardPayload,
} from "./tasksSlice";
import { waitFor } from "@testing-library/react";
import {
  todoTasks,
  inProgressTasks,
  completeBoards,
  doneTasks,
  tasks,
} from "../../testData";
import { Task } from "../../types";
import TaskService from "../../services/TaskService";

jest.mock("../../services/TaskService");
const mockedService = TaskService as jest.Mocked<typeof TaskService>;

describe("features/tasks", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("selectors", () => {
    it("should translate the state to create boards", () => {
      const todoTask = todoTasks[0];
      const inProgressTask = inProgressTasks[0];
      const doneTask = doneTasks[0];
      const newInitialState = JSON.parse(JSON.stringify(initialState));
      newInitialState.records[todoTask.status].tasks = todoTasks;
      newInitialState.records[inProgressTask.status].tasks = inProgressTasks;
      newInitialState.records[doneTask.status].tasks = doneTasks;

      const boardsToTest = selectBoards({
        tasks: newInitialState,
      });
      expect(boardsToTest).toEqual(completeBoards);
    });
  });

  describe("reducers", () => {
    it("should handle adding a task", () => {
      const task = todoTasks[0];
      const newState = JSON.parse(JSON.stringify(initialState));
      newState.records[task.status].tasks.push(task);
      expect(
        reducer(initialState, {
          type: addTask.type,
          payload: task,
        })
      ).toEqual(newState);
    });
    it("should handle removing a task", () => {
      const task = todoTasks[0];
      const newState = JSON.parse(JSON.stringify(initialState));
      newState.records[task.status].tasks.push(tasks[0]);
      newState.records[task.status].tasks.push(tasks[1]);
      const testState = JSON.parse(JSON.stringify(initialState));
      testState.records[task.status].tasks.push(tasks[0]);
      expect(
        reducer(newState, {
          type: removeTask.type,
          payload: tasks[1],
        })
      ).toEqual(testState);
    });
    it("should handle hydrating task records", () => {
      expect(
        reducer(initialState, {
          type: hydrate.type,
          payload: tasks,
        })
      ).toEqual({
        ...initialState,
        records: completeBoards.reduce((previous, current) => {
          return {
            ...previous,
            [current.id]: {
              label: current.label,
              tasks: current.tasks,
            },
          };
        }, {} as TasksState),
      });
    });
    it("should handle changing the status of a task", () => {
      const task = todoTasks[0];
      const newInitialState = JSON.parse(JSON.stringify(initialState));
      newInitialState.records[task.status].tasks.push(task);
      const testState = JSON.parse(JSON.stringify(initialState));
      const updatedTask: Task = { ...task, status: "DOING" };
      testState.records[task.status].tasks.push(updatedTask);
      expect(
        reducer(newInitialState, {
          type: changeTaskStatus.type,
          payload: {
            id: task.id,
            boardId: task.status,
            status: "DOING",
          },
        })
      ).toEqual(testState);
    });

    it("should handle moving a task to the same board", () => {
      const task = todoTasks[0];
      const newInitialState = JSON.parse(JSON.stringify(initialState));
      newInitialState.records[task.status].tasks = todoTasks;
      const testState = JSON.parse(JSON.stringify(initialState));
      testState.records[task.status].tasks = [
        todoTasks[1],
        todoTasks[2],
        todoTasks[0],
      ];
      expect(
        reducer(newInitialState, {
          type: moveTaskToSameBoard.type,
          payload: {
            id: task.status,
            sourceIndex: 0,
            destinationIndex: 2,
          },
        })
      ).toEqual(testState);
    });

    it("should handle moving a task from one board to another board", () => {
      const todoTask = todoTasks[0];
      const inProgressTask = inProgressTasks[0];
      const newInitialState = JSON.parse(JSON.stringify(initialState));
      newInitialState.records[todoTask.status].tasks = todoTasks;
      newInitialState.records[inProgressTask.status].tasks = inProgressTasks;
      const testState = JSON.parse(JSON.stringify(initialState));
      const testTask = JSON.parse(JSON.stringify(todoTasks[1]));
      testTask.status = inProgressTask.status;
      testState.records[todoTask.status].tasks = [todoTasks[0], todoTasks[2]];
      testState.records[inProgressTask.status].tasks = [
        inProgressTasks[0],
        testTask,
        inProgressTasks[1],
        inProgressTasks[2],
      ];
      expect(
        reducer(newInitialState, {
          type: moveTaskToAnotherBoard.type,
          payload: {
            source: {
              id: todoTask.status,
              index: 1,
            },
            destination: {
              id: inProgressTask.status,
              index: 1,
            },
          },
        })
      ).toEqual(testState);
    });
  });
  describe("asyncActions", () => {
    it("should save a task and dispatch necessary state change", async () => {
      const task = tasks[0];
      const newInitialState = JSON.parse(JSON.stringify(initialState));
      newInitialState.records.TODO.tasks.push(task);
      const state = (): { tasks: TasksState } => ({
        tasks: newInitialState,
      });

      mockedService.add.mockResolvedValue(Promise.resolve(task));
      const partial = {
        name: task.name,
        content: task.content,
      };
      const method = saveTask(partial);
      const dispatch = jest.fn();
      method(dispatch, state, {});

      expect(mockedService.add).toHaveBeenCalledWith(partial);
      await waitFor(() => {
        expect(mockedService.update).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(addTask(task));
      });
    });
    it("fetches the tasks and hydrate the store", async () => {
      const state = (): { tasks: TasksState } => ({
        tasks: initialState,
      });
      const method = fetchTasks();
      mockedService.fetchAll.mockResolvedValueOnce(Promise.resolve(tasks));
      const dispatch = jest.fn();
      method(dispatch, state, {});
      expect(mockedService.fetchAll).toHaveBeenCalled();
      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(hydrate(tasks));
      });
    });
    it("updates task to the same board", async () => {
      const task = todoTasks[0];
      const newInitialState = JSON.parse(JSON.stringify(initialState));
      const reorderedTasks = [todoTasks[1], todoTasks[2], todoTasks[0]];
      newInitialState.records.TODO.tasks = reorderedTasks;
      const state = (): { tasks: TasksState } => ({
        tasks: newInitialState,
      });
      const payload = {
        id: task.status,
        sourceIndex: 0,
        destinationIndex: 2,
      };
      const method = updateTaskToSameBoard(payload);
      const dispatch = jest.fn();
      method(dispatch, state, {});
      expect(dispatch).toHaveBeenCalledWith(moveTaskToSameBoard(payload));
      await waitFor(() => {
        expect(mockedService.update).toHaveBeenCalledTimes(3);
        reorderedTasks.forEach((orderTask, index) => {
          expect(mockedService.update).toHaveBeenCalledWith(orderTask.id, {
            ...orderTask,
            priority: index,
          });
        });
      });
    });
    it("updates task to the another board", async () => {
      const todoTask = todoTasks[0];
      const inProgressTask = inProgressTasks[0];
      const newInitialState = JSON.parse(JSON.stringify(initialState));
      const reorderedTodoTasks = [todoTasks[0], todoTasks[2]];
      const reorderedInProgressTasks = [
        inProgressTasks[0],
        { ...todoTasks[1], status: inProgressTask.status },
        inProgressTasks[1],
        inProgressTasks[2],
      ];
      newInitialState.records.TODO.tasks = reorderedTodoTasks;
      newInitialState.records.DOING.tasks = reorderedInProgressTasks;
      const state = (): { tasks: TasksState } => ({
        tasks: newInitialState,
      });
      const payload: TaskMoveToAnotherBoardPayload = {
        source: {
          id: todoTask.status,
          index: 1,
        },
        destination: {
          id: inProgressTask.status,
          index: 1,
        },
      };
      const method = updateTaskToAnotherBoard(payload);
      const dispatch = jest.fn();
      method(dispatch, state, {});
      expect(dispatch).toHaveBeenCalledWith(moveTaskToAnotherBoard(payload));
      await waitFor(() => {
        expect(mockedService.update).toHaveBeenCalledTimes(6);
        reorderedTodoTasks.forEach((orderTask, index) => {
          expect(mockedService.update).toHaveBeenCalledWith(orderTask.id, {
            ...orderTask,
            priority: index,
          });
        });
        reorderedInProgressTasks.forEach((orderTask, index) => {
          expect(mockedService.update).toHaveBeenCalledWith(orderTask.id, {
            ...orderTask,
            priority: index,
          });
        });
      });
    });
    it("delete the task", async () => {
      const task = todoTasks[0];
      const state = (): { tasks: TasksState } => ({
        tasks: initialState,
      });
      const method = deleteTask(task);
      mockedService.remove.mockResolvedValueOnce(Promise.resolve(true));
      const dispatch = jest.fn();
      method(dispatch, state, {});
      expect(mockedService.remove).toHaveBeenCalledWith(task.id);
      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(removeTask(task));
      });
    });
  });
});
