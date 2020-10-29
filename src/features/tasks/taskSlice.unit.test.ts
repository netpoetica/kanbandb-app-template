import reducer, {
  initialState,
  moveTaskToAnotherBoard,
  moveTaskToSameBoard,
  addTask,
  removeTask,
  hydrate,
  changeTaskStatus,
  selectBoards,
  TasksState,
} from "./tasksSlice";
import {
  todoTasks,
  inProgressTasks,
  completeBoards,
  doneTasks,
  tasks,
} from "../../testData";
import { Task } from "../../types";

describe("features/tasks/reducer", () => {
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

describe("features/tasks/selectors", () => {
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
